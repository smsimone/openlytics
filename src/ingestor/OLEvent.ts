export default interface OLEvent {
    event: string;
    properties: Record<string, any>;
    createdAt?: number;
    userId: string;
}