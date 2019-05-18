export type SupportedNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type removeFirstTupleItems<
    Tuple extends Array<any>,
    N extends SupportedNumbers
> = {
    finished: Tuple,
    continuing: removeFirstTupleItems<removeFirstTupleItem<Tuple>, Prev<N>>
}[
    Tuple extends []
        ? 'finished'
        : N extends 0
            ? 'finished'
            : 'continuing'
];

type removeFirstTupleItem<Tuple extends Array<any>> =
    ((...tuple: Tuple) => any) extends ((first: any, ...removed: infer Result) => any)
        ? Result
        : never;

type Prev<T extends SupportedNumbers> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T];