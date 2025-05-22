
export class ListViewItem {
    
}

export interface ListViewItemClass<T extends ListViewItem> {
    new(): T;
    prefabPath: string;
}

export interface listviewItemSlot {
    item: ListViewItem,
    index: number,
}

