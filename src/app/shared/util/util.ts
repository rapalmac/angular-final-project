export class SelectionObject<Type> {
    private _selectedData?:Type;
    private _attributes:any;

    constructor();
    constructor(data:Type)
    constructor (data?:Type) {
        if (data) {
            this._selectedData = data;
        }
        this._attributes = {};
    }

    setData(_data:Type) {
        this._selectedData = _data;
    }

    get data():Type {
        return this._selectedData!;
    }

    setAttribute(key:string, value:any): void {
        this._attributes[key] = value;
    }

    getAttribute(key:string):any {
        return this._attributes[key];
    }

    reset():void {
        this._selectedData = undefined;
    }

    isSelected():boolean {
        return this._selectedData != null;
    }

    toString():string {
        return JSON.stringify({
            data: this._selectedData,
            attributes: this._attributes
        });
    }
}

export function getItemIndexByCode(_array:Array<any>, _code:string) {
    return _array.findIndex(e => e.code === _code);
}

export function modelComparator(o1:any, o2:any) { 
    return o1.id === o2?.id 
};