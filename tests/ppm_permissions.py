"""Regression checks against the configured Cloud instance, without printing credentials."""
import json
import os
import re
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


class AnonymousBusinessAccessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        config = Path('.env').read_text()
        def setting(name):
            value = os.environ.get(name)
            if value:
                return value
            match = re.search(r'^' + name + r'=["\']?([^"\'\n]+)', config, re.M)
            if not match:
                raise RuntimeError('Missing test configuration')
            return match.group(1)
        cls.url = setting('VITE_SUPABASE_URL')
        cls.key = setting('VITE_SUPABASE_PUBLISHABLE_KEY')

    def request(self, path, method='GET', payload=None):
        headers = {'apikey': self.key, 'Content-Type': 'application/json'}
        request = Request(self.url + '/rest/v1/' + path, headers=headers, method=method,
                          data=json.dumps(payload).encode() if payload is not None else None)
        try:
            with urlopen(request, timeout=20) as response:
                return response.status, json.loads(response.read())
        except HTTPError as error:
            return error.code, None

    def test_anonymous_cannot_read_business_snapshot(self):
        status, _ = self.request('rpc/ppm_snapshot', 'POST', {})
        self.assertIn(status, (401, 403))

    def test_anonymous_cannot_list_portfolios(self):
        status, rows = self.request('portfolios?select=id&limit=1')
        self.assertTrue(status in (401, 403) or (status == 200 and rows == []))


if __name__ == '__main__':
    unittest.main()