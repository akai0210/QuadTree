import QTreeManager from "./QTreeManager";

enum QuadranType {
    LT = 0, //left top
    RT = 1, // right top
    RB = 2, // right bottom
    LB = 3, //left bottom
}
//矩形区域
interface IRect {
    x: number, // Rectangle center X
    y: number, //Rectangle center Y
    width: number,//Rectangle width
    height: number //Rectangle height
}


//四叉树的结构
export default class QTree<T> implements IRect {

    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public depth: number = 0; //树的深度
    public childCount: number = 0; //子元素数量
    public isLeaf: boolean = false; //是否叶子节点
    public childList: Array<T>;
    public childNode: Array<QTree<T>>;

    public QTree(depth?: number): void {
        this._Init();
        this.depth = depth;
    }

    private _Init(): void {
        this.childList = new Array<T>();
        this.isLeaf = true;
        this.childCount = 0;
    }

    public initRect(x: number, y: number, width: number, height: number): void {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }


    public clear(): void {
        if (this.isLeaf) {
            this.childList = [];

        } else {
            for (let i = 0; i < this.childNode.length; i++) {
                this.childNode[i].clear();
                this.childNode[i] = null;
            }
            this.childNode = [];
        }
    }

    /**
     * 插入树
     * @param node 
     * @param t 
     */
    public InsertQTree<T extends IRect>(node: QTree<T>, t: T): void {
        if (node.isLeaf) {
            if (node.depth < QTreeManager.MAXDEPTH && node.childCount + 1 > QTreeManager.MAXCHILDCOUNT) {
                // 分裂象限
            } else {
                node.childList.push(t);
                node.childCount++;
            }
        } else {
            const indexs: Array<number> = []
            if (indexs != null && indexs.length > 0) {
                for (let i = 0; i < indexs.length; i++) {
                    this.InsertQTree<T>(node.childNode[indexs[i]], t);
                }
            }
        }
    }


    /**
     * 分离树
     * @param node 
     */
    private SplitQTree<T extends IRect>(node: QTree<T>): void {
        node.isLeaf = false;
        let _width: number = node.width;
        let _height: number = node.height;

        // node.childNode
        node.childNode[QuadranType.LT] = this.CreateChidNode(node.x - _width, node.y + _height, _width, _height, node.depth + 1);
        node.childNode[QuadranType.RT] = this.CreateChidNode(node.x + _width, node.y + _height, _width, _height, node.depth + 1);
        node.childNode[QuadranType.RB] = this.CreateChidNode(node.x + _width, node.y - _height, _width, _height, node.depth + 1);
        node.childNode[QuadranType.LB] = this.CreateChidNode(node.x - _width, node.y - _height, _width, _height, node.depth + 1);

        for (let i = node.childCount - 1; i >= 0; i--) {
            this.InsertQTree<T>(node, node.childList[i]);
            node.childList.unshift();
            node.childCount--;
        }

    }

    /**
     * 创建子树
     * @param x 
     * @param y 
     * @param wid 
     * @param height 
     * @param depth 
     */
    private CreateChidNode<T extends IRect>(x: number, y: number, wid: number, height: number, depth: number): QTree<T> {
        const node = new QTree<T>();
        node.depth = depth;
        node.initRect(x, y, wid, height);
        return node;
    }


    public GetTargetQuadrantIndex<T extends IRect>(node: QTree<T>, target: T): Array<number> {
        let halfWidth: number = node.width;
        let halfHeight: number = node.height;
        let min_x: number = target.x - target.width;
        let min_y: number = target.y - target.height;
        let max_x: number = target.x + target.width;
        let max_y: number = target.y + target.height;

        //不在当前节点范围内返回null
        if (min_x > node.x + halfWidth || max_x < node.x - halfWidth || min_y > node.y + halfHeight || max_y < node.y - halfHeight) {
                return null;
        }   


        return
    }





}