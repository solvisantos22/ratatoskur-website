import { test, expect, vi, beforeEach } from 'vitest';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock('resend', () => ({
  // vitest v4 requires a regular function (not arrow) for constructors used with `new`
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from './route';

function req(body: unknown) {
  return { json: async () => body } as unknown as Parameters<typeof POST>[0];
}
const valid = { name: 'Anna', email: 'anna@school.is', organization: 'MS', message: 'We would like a pilot.', website: '' };

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
  delete process.env.RESEND_API_KEY;
});

test('400 on invalid body', async () => {
  const res = await POST(req({ name: '', email: 'x' }));
  expect(res.status).toBe(400);
  expect(sendMock).not.toHaveBeenCalled();
});
test('200 and no email when honeypot filled', async () => {
  process.env.RESEND_API_KEY = 'key';
  const res = await POST(req({ ...valid, website: 'spam' }));
  expect(res.status).toBe(200);
  expect(sendMock).not.toHaveBeenCalled();
});
test('503 when API key missing', async () => {
  const res = await POST(req(valid));
  expect(res.status).toBe(503);
});
test('200 and sends email when configured', async () => {
  process.env.RESEND_API_KEY = 'key';
  const res = await POST(req(valid));
  expect(res.status).toBe(200);
  expect(sendMock).toHaveBeenCalledOnce();
});
