declare namespace Trezor {
  export interface EtherAddress {
    address: string;
  }

  interface Device {
    run<R = any>(callback: (session: Trezor.Session) => Promise<R>): Promise<R>
  }

  interface Session {
    getEthereumAddress(path: number[]): Promise<Trezor.EtherAddress>;
  }
}
