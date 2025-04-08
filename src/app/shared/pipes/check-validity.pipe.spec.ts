import { CheckValidityPipe } from './check-validity.pipe';

describe('CheckValidityPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckValidityPipe();
    expect(pipe).toBeTruthy();
  });
});
