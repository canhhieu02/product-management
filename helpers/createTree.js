let count = 0;

createTree = (array, parentId = "") => {
    const newArray = [];

    for (const item of array) {
        if(item.parent_id == parentId) {
            count++;
            const newItem = item;
            newItem.index= count;
            const children = createTree(array, item.id);
            if(children.length > 0) {
                newItem.children = children;
            }
            newArray.push(item);
        }
    }
    return newArray;
}

module.exports.Tree = (array, parentId = "") => {
    count = 0;
    const Tree = createTree(array, parentId = "");
    return Tree;
}