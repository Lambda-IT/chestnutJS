import { StaticModule } from './static.module';

describe('StaticModule', () => {
  let staticModule: StaticModule;

  beforeEach(() => {
    staticModule = new StaticModule();
  });

  it('should create an instance', () => {
    expect(staticModule).toBeTruthy();
  });
});
