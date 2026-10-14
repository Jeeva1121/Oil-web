import urllib.request
import re

try:
    with urllib.request.urlopen('http://localhost:5173') as resp:
        html = resp.read().decode('utf-8')
    print('HTML loaded, length:', len(html))
    scripts = re.findall(r'src="([^"]+)"', html)
    print('Found scripts:', scripts)
    for s in scripts:
        url = 'http://localhost:5173' + s if s.startswith('/') else 'http://localhost:5173/' + s
        with urllib.request.urlopen(url) as js_resp:
            content = js_resp.read().decode('utf-8')
            print(f'{s}: OK ({len(content)} bytes)')
except Exception as e:
    print('Error:', e)
