const generateUid = (collectionofIds: Array<any>) => {
    let uid = collectionofIds.reduce((a,b)=>Math.max(a,b),0);
    return ++uid
}


export default generateUid