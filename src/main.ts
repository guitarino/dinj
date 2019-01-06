export class DIContainer {
    register(...something: any) {
        return {
            as: function<T>(...something: any) {

            }
        }
    }
}

export function TypeIdentifier() {

}

export function injectable(...something1: any) {
    return function (...something2: any) {
        
    }
}