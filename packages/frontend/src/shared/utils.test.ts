describe('utils.ts', () => {
  describe('getBaseUrl', () => {
    const utils = require('./utils');
    it('should return base url from REACT_APP_DEV_API_URL when is in dev', () => {
      expect(utils.getBaseUrl('development', 'api_url')).toEqual('api_url');
    });

    it('should return empty string when is not in dev ', () => {
      expect(utils.getBaseUrl('other', 'api_url')).toEqual('');
    });
  });

  describe('fetchUtils', () => {
    let utils;
    beforeEach(() => {
      jest.resetModules();
    });
    it.each`
      data              | status | env
      ${'data'}         | ${200} | ${200}
      ${'data'}         | ${299} | ${200}
      ${{ changes: 1 }} | ${500} | ${200}
    `(
      'should resolved $data when response.status $status is between 200 and 299 or when result.change !== 0',
      async ({ data, status }) => {
        utils = require('./utils');
        // @ts-ignore
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve(data),
            status: status,
          }),
        );

        await expect(
          utils.fetchUtils('uri', 'httpMethod', 'body'),
        ).resolves.toBe(data);
        expect(fetch).toHaveBeenCalledWith('uri', {
          body: 'body',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          method: 'httpMethod',
        });
      },
    );

    it.each`
      data              | status
      ${'data'}         | ${300}
      ${'data'}         | ${500}
      ${undefined}      | ${500}
      ${{ changes: 0 }} | ${500}
    `(
      'should reject $data when response.status $status is not between 200 and 299 or when result.changes === 0',
      async ({ data, status }) => {
        utils = require('./utils');
        // @ts-ignore
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve(data),
            status: status,
          }),
        );
        await expect(
          utils.fetchUtils('uri', 'httpMethod', 'body'),
        ).rejects.toBe(data);
        expect(fetch).toHaveBeenCalledWith('uri', {
          body: 'body',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          method: 'httpMethod',
        });
      },
    );

    it('should call fetch with include credentials when NODE_ENV is development', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      utils = require('./utils');
      // @ts-ignore
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve('data'),
          status: 200,
        }),
      );
      await expect(
        utils.fetchUtils('/url', 'httpMethod', 'body'),
      ).resolves.toBe('data');
      expect(fetch).toHaveBeenCalledWith('http://localhost:8888/url', {
        body: 'body',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'httpMethod',
      });
    });
  });
});
