interface DiographParams {
    path: string;
}
interface Diograph {
    rootId: string;
    diograph: object;
}
declare class Diograph {
    path: string;
    rootId: string;
    diograph: object;
    constructor({ path }: DiographParams);
    load: () => Promise<unknown>;
    get: (id: string) => any;
}
export default Diograph;
