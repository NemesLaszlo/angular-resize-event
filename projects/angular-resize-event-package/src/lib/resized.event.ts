export class ResizedEvent {
    public readonly newRect: DOMRectReadOnly;
    public readonly oldRect?: DOMRectReadOnly;
    public readonly isFirst: boolean;

    public constructor(newRect: DOMRectReadOnly, oldRect: DOMRectReadOnly | undefined) {
        this.newRect = newRect;
        this.oldRect = oldRect;
        this.isFirst = oldRect == null;
    }
}
