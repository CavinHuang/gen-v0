
export class RuntimeService {

  // 检测url是否可以连通
  async checkRuntimeURI(uri: string) {
    try {
      const res = await fetch(uri, {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return res.status === 200;
    } catch (error) {
      return false;
    }
  }
}

const runtimeService = new RuntimeService();

export default runtimeService;