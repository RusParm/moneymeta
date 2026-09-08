"""Audit the complete static output without network requests or extra packages."""
import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, path, url):
        super().__init__(convert_charrefs=True)
        self.path, self.url = path, url
        self.ids, self.links, self.canonical, self.alternates = [], [], [], {}
        self.meta, self.headings, self.text = {}, Counter(), []
        self.aria_refs = []
        self.skip = 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag in ('script', 'style'):
            self.skip += 1
        for attribute in ('aria-labelledby', 'aria-describedby'):
            self.aria_refs.extend(attrs.get(attribute, '').split())
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag in ('h1', 'h2'):
            self.headings[tag] += 1
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs.get('href', ''))
        if tag == 'link' and attrs.get('rel') == 'alternate':
            self.alternates[attrs.get('hreflang')] = attrs.get('href')
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, value):
        if not self.skip:
            self.text.append(value)


def audit(root):
    origin = 'https://themoneymeta.com'
    pages = {}
    for path in sorted(root.rglob('*.html')):
        relative = path.relative_to(root).as_posix()
        url = '/' + relative.removesuffix('index.html') if relative.endswith('index.html') else '/' + relative
        pages[url] = Page(path, url)
    errors, warnings, rows = [], [], []
    links_checked = 0
    for url, page in pages.items():
        if url == '/404.html':
            continue
        if page.headings['h1'] != 1:
            errors.append(f'{url}: expected one h1, found {page.headings["h1"]}')
        if page.canonical != [origin + url]:
            errors.append(f'{url}: canonical does not match route')
        for reference in set(page.aria_refs) - set(page.ids):
            errors.append(f'{url}: unresolved accessibility reference {reference}')
        duplicate_ids = [key for key, count in Counter(page.ids).items() if count > 1]
        if duplicate_ids:
            errors.append(f'{url}: duplicate IDs {duplicate_ids}')
        expected = {'ru': origin + (url[3:] if url.startswith('/en/') else url),
                    'en': origin + (url if url.startswith('/en/') else '/en' + url)}
        if any(page.alternates.get(key) != value for key, value in expected.items()):
            warnings.append(f'{url}: incomplete self/alternate hreflang pair')
        if not page.meta.get('og:image'):
            warnings.append(f'{url}: no social preview image')
        for href in page.links:
            target = urlsplit(urljoin(origin + url, href))
            if target.scheme not in ('http', 'https') or target.netloc != 'themoneymeta.com':
                continue
            links_checked += 1
            target_path = unquote(target.path)
            target_page = pages.get(target_path)
            if target_page is None:
                if not (root / target_path.lstrip('/')).is_file():
                    errors.append(f'{url}: missing route {href}')
            elif target.fragment and unquote(target.fragment) not in target_page.ids:
                errors.append(f'{url}: missing fragment {href}')
        rows.append({'path': url, 'htmlBytes': page.path.stat().st_size,
                     'wordsIncludingCollapsedPanels': len(' '.join(page.text).split()),
                     'h2': page.headings['h2'], 'links': len(page.links)})
    sitemap = root / 'sitemap.xml'
    if sitemap.exists():
        urls = ET.parse(sitemap).getroot()
        sitemap_paths = [urlsplit(element.text or '').path for element in urls.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
        indexable = {url for url, page in pages.items() if 'noindex' not in page.meta.get('robots', '')}
        for path in indexable - set(sitemap_paths):
            errors.append(f'{path}: absent from sitemap')
        for path in set(sitemap_paths) & (set(pages) - indexable):
            errors.append(f'{path}: noindex page appears in sitemap')
        for path in set(sitemap_paths) - set(pages):
            errors.append(f'{path}: sitemap points to a missing page')
    else:
        errors.append('Missing sitemap.xml')
    return {'pages': len(pages), 'internalLinksChecked': links_checked,
            'errors': errors, 'warnings': warnings, 'inventory': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default='dist')
    parser.add_argument('--report', help='Optional JSON report path')
    args = parser.parse_args()
    root = Path(args.root)
    if not root.is_dir():
        parser.error('Build the site before running the audit.')
    result = audit(root)
    if args.report:
        Path(args.report).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pages': result['pages'], 'internalLinksChecked': result['internalLinksChecked'],
                      'errors': result['errors'],
                      'warningCounts': dict(Counter(warning.split(': ', 1)[1] for warning in result['warnings']))},
                     ensure_ascii=False, indent=2))
    raise SystemExit(bool(result['errors']))
