export function IsValidEmail(email : string) : boolean{
    const EmailFormatChecker : RegExp = /^[a-zA-Z]([a-zA-Z0-9]+)@(([a-z]+).+).([a-z]+)/g;
    return EmailFormatChecker.test(email);
}
/**
 * target 객체의 요소 중 obj 객체에 없는 요소만을 가지는 객체 반환하는 함수
 * 집합 A,B에 대하여 A 차집합 B의 효과를 가지는 함수
 * @param target 
 * @param obj 
 * @returns
 */
export function getPropertyOfDifferenceSet<T extends Object>(target : T, obj : T) : T {
    let result : T = <T>{};
    const keySet = new Set<string>();

    for(const key of Object.keys(target))
        keySet.add(key);
    
    for(const key of Object.keys(obj))
        if(keySet.has(key))
            keySet.delete(key);

    for(const key of keySet){
        result[key] = target[key];
    }
    
    return result;
}

/**
 * target 객체에 obj 객체를 할당하는 함수
 * @param target 
 * @param obj
 * @returns 
 */
export function toConcatObject<T>(target : T, obj : T) : T{
    return Object.assign({}, target, obj);
}