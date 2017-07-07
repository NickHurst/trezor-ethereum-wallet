declare namespace Trezor {
  export interface EtherAddress {
    address: string;
  }

  interface Device {
    run<R = object>(callback: (session: Trezor.Session) => Promise<R>): Promise<R>
  }

  interface Session {
    getEthereumAddress(path: number[]): Promise<Trezor.EtherAddress>;
  }
}

declare class Device {
  run<R = object>(callback: (session: object) => Promise<R>): Promise<R>
}

declare class Session {
  getEthereumAddress(path: number[]): Promise<Trezor.EtherAddress>
}
