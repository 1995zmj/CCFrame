export class ListViewController {
    _scrollView
    _item
    items = []
    _data
    _contentHeight = 0
    _startIndex
    _endIndex
    _owner
    _func
    constructor(owner, scrollView: cc.ScrollView, item: cc.Node, func: (node: cc.Node, index: number, data: any) => void, spawnCount: number = 5) {
        this._owner = owner
        this._scrollView = scrollView
        this._item = item
        this._func = func.bind(owner)
        this._scrollView.content.removeAllChildren()
        for (let index = 0; index < spawnCount; index++) {
            let tempItem = cc.instantiate<cc.Node>(this._item)
            this._scrollView.content.addChild(tempItem)
            tempItem.active = false
            this.items.push(tempItem)
        }
        this._scrollView.node.on('scrolling', this.scrollingEvent, this);
    }

    public updateData(data) {
        this._data = data
        let tempItemheight = Math.abs(this._item.height)
        this._scrollView.content.height = tempItemheight * this._data.length
        for (let index = 0; index < this.items.length; index++) {
            const element = this.items[index];
            element.active = index < this._data.length
        }
        this.updateItem()
    }

    public updateItem() {
        let offset = this._scrollView.getScrollOffset().y
        let pre = offset / (this._scrollView.content.height - this._scrollView.node.height)
        pre = Math.max(0, pre)
        pre = Math.min(1, pre)
        this._startIndex = Math.floor(pre * (this._data.length - this.items.length + 1))
        this._startIndex = Math.max(0, this._startIndex)
        this._endIndex = Math.min(this._startIndex + this.items.length, this._data.length)
        // console.log('s - e, ', this._startIndex, this._endIndex)
        // TODO 后面不是每个都更新
        for (let index = this._startIndex; index < this._endIndex; index++) {
            let curIndex = index % this.items.length
            let tempNode = this.items[curIndex]
            tempNode.setPosition(tempNode.x, -index * this._item.height)
            tempNode.active = true
            this._func(this.items[curIndex], index, this._data[index])
        }
    }

    public scrollingEvent() {
        this.updateItem()
    }
}

export class HListViewController {
    _scrollView
    _item
    items = []
    _data
    _contentHeight = 0
    _startIndex
    _endIndex
    _owner
    _func
    constructor(owner, scrollView: cc.ScrollView, item: cc.Node, func: (node: cc.Node, index: number, data: any) => void, spawnCount: number = 5) {
        this._owner = owner
        this._scrollView = scrollView
        this._item = item
        this._func = func.bind(owner)
        this._scrollView.content.removeAllChildren()
        for (let index = 0; index < spawnCount; index++) {
            let tempItem = cc.instantiate<cc.Node>(this._item)
            this._scrollView.content.addChild(tempItem)
            tempItem.active = false
            this.items.push(tempItem)
        }
        this._scrollView.node.on('scrolling', this.scrollingEvent, this);
    }

    public updateData(data) {
        this._data = data
        let tempItemWidth = Math.abs(this._item.width)
        this._scrollView.content.width = tempItemWidth * this._data.length
        for (let index = 0; index < this.items.length; index++) {
            const element = this.items[index];
            element.active = index < this._data.length
        }
        this.updateItem()
    }

    public updateItem() {
        let offset = this._scrollView.getScrollOffset().x
        // console.log('offset, ', offset)
        let tempDis = this._scrollView.content.width - this._scrollView.node.width
        let pre = 0
        if (tempDis > 0) {
            pre = offset / (this._scrollView.content.width - this._scrollView.node.width)
        }
        pre = Math.max(0, pre)
        pre = Math.min(1, pre)
        // console.log('pre, ', pre)
        this._startIndex = Math.floor(pre * (this._data.length - this.items.length + 1))
        this._endIndex = Math.min(this._startIndex + this.items.length, this._data.length)
        // console.log('s - e, ', this._startIndex, this._endIndex)
        // TODO 后面不是每个都更新
        for (let index = this._startIndex; index < this._endIndex; index++) {
            let curIndex = index % this.items.length
            let tempNode = this.items[curIndex]
            tempNode.setPosition(index * this._item.width, tempNode.y)
            // tempNode.active = true
            this._func(this.items[curIndex], index, this._data[index])
        }
    }

    public scrollingEvent() {
        this.updateItem()
    }
}