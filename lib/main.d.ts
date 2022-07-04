// Type definitions for webpubsub
// Project: https://github.com/webpubsub/javascript
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// @see https://www.webpubsub.com/docs/web-javascript/api-reference-configuration
// TypeScript Version: 3.5

// SDK callbacks all accept Webpubsub.WebpubsubStatus as the first argument
type Callback<ResponseType> = (status: Webpubsub.WebpubsubStatus, response: ResponseType) => void;
type StatusCallback = (status: Webpubsub.WebpubsubStatus) => void;
interface ObjectsResponse<DataType> {
    status: number;
    data: DataType;
}
interface PagedObjectsResponse<DataType> extends ObjectsResponse<DataType[]> {
    prev?: string | undefined;
    next?: string | undefined;
    totalCount?: number | undefined;
}
// partial but everything can be null (even with strictNullChecks)
type Nullable<T> = {
    [P in keyof T]?: T[P] | null;
};

declare class Webpubsub {
    constructor(config: Webpubsub.WebpubsubConfig);

    static CATEGORIES: Webpubsub.Categories;

    static OPERATIONS: Webpubsub.Operations;

    static generateUUID(): string;

    static notificationPayload(title: string, body: string): Webpubsub.NotificationsPayload;

    channelGroups: Webpubsub.ChannelGroups;

    push: Webpubsub.Push;

    setUUID(uuid: string): void;

    getUUID(): string;

    setAuthKey(authKey: string): void;

    setFilterExpression(filterExpression: string): void;

    getFilterExpression(): string;

    // publish

    publish(params: Webpubsub.PublishParameters, callback: Callback<Webpubsub.PublishResponse>): void;

    publish(params: Webpubsub.PublishParameters): Promise<Webpubsub.PublishResponse>;

    fire(params: Webpubsub.FireParameters, callback: Callback<Webpubsub.PublishResponse>): void;

    fire(params: Webpubsub.FireParameters): Promise<Webpubsub.PublishResponse>;

    signal(params: Webpubsub.SignalParameters, callback: Callback<Webpubsub.SignalResponse>): void;

    signal(params: Webpubsub.SignalParameters): Promise<Webpubsub.SignalResponse>;

    // history

    history(params: Webpubsub.HistoryParameters, callback: Callback<Webpubsub.HistoryResponse>): void;

    history(params: Webpubsub.HistoryParameters): Promise<Webpubsub.HistoryResponse>;

    fetchMessages(params: Webpubsub.FetchMessagesParameters, callback: Callback<Webpubsub.FetchMessagesResponse>): void;

    fetchMessages(params: Webpubsub.FetchMessagesParameters): Promise<Webpubsub.FetchMessagesResponse>;

    deleteMessages(params: Webpubsub.DeleteMessagesParameters, callback: StatusCallback): void;

    deleteMessages(params: Webpubsub.DeleteMessagesParameters): Promise<void>;

    messageCounts(params: Webpubsub.MessageCountsParameters, callback: Callback<Webpubsub.MessageCountsResponse>): void;

    messageCounts(params: Webpubsub.MessageCountsParameters): Promise<Webpubsub.MessageCountsResponse>;

    // subscriptions

    subscribe(params: Webpubsub.SubscribeParameters): void;

    unsubscribe(params: Webpubsub.UnsubscribeParameters): void;

    unsubscribeAll(): void;

    stop(): void;

    reconnect(): void;

    addListener(params: Webpubsub.ListenerParameters): void;

    removeListener(params: Webpubsub.ListenerParameters): void;

    getSubscribedChannels(): string[];

    getSubscribedChannelGroups(): string[];

    // presence

    hereNow(params: Webpubsub.HereNowParameters, callback: Callback<Webpubsub.HereNowResponse>): void;

    hereNow(params: Webpubsub.HereNowParameters): Promise<Webpubsub.HereNowResponse>;

    whereNow(params: Webpubsub.WhereNowParameters, callback: Callback<Webpubsub.WhereNowResponse>): void;

    whereNow(params: Webpubsub.WhereNowParameters): Promise<Webpubsub.WhereNowResponse>;

    getState(params: Webpubsub.GetStateParameters, callback: Callback<Webpubsub.GetStateResponse>): void;

    getState(params: Webpubsub.GetStateParameters): Promise<Webpubsub.GetStateResponse>;

    setState(params: Webpubsub.SetStateParameters, callback: Callback<Webpubsub.SetStateResponse>): void;

    setState(params: Webpubsub.SetStateParameters): Promise<Webpubsub.SetStateResponse>;

    // access manager

    grant(params: Webpubsub.GrantParameters, callback: StatusCallback): void;

    grant(params: Webpubsub.GrantParameters): Promise<void>;

    grantToken(params: Webpubsub.GrantTokenParameters, callback: Callback<string>): void;

    grantToken(params: Webpubsub.GrantTokenParameters): Promise<string>;

    setToken(params: string): void;

    parseToken(params: string): Webpubsub.ParsedGrantToken;

    revokeToken(params: string, callback: Callback<Webpubsub.RevokeTokenResponse>): void;

    revokeToken(params: string): Promise<Webpubsub.RevokeTokenResponse>;

    // files

    listFiles(params: Webpubsub.ListFilesParameters, callback: Callback<Webpubsub.ListFilesResponse>): void;

    listFiles(params: Webpubsub.ListFilesParameters): Promise<Webpubsub.ListFilesResponse>;

    sendFile(params: Webpubsub.SendFileParameters, callback: Callback<Webpubsub.SendFileResponse>): void;

    sendFile(params: Webpubsub.SendFileParameters): Promise<Webpubsub.SendFileResponse>;

    downloadFile(params: Webpubsub.DownloadFileParameters, callback: Callback<any>): void;

    downloadFile(params: Webpubsub.DownloadFileParameters): Promise<any>;

    getFileUrl(params: Webpubsub.FileInputParameters): string;

    deleteFile(params: Webpubsub.FileInputParameters, callback: StatusCallback): void;

    deleteFile(params: Webpubsub.FileInputParameters): Promise<Webpubsub.DeleteFileResponse>;

    publishFile(params: Webpubsub.PublishFileParameters, callback: Callback<Webpubsub.PublishFileResponse>): void;

    publishFile(params: Webpubsub.PublishFileParameters): Promise<Webpubsub.PublishFileResponse>;

    // objects v2
    objects: {
        // UUID metadata
        setUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.SetUUIDMetadataParameters<Custom>,
            callback: Callback<Webpubsub.SetUUIDMetadataResponse<Custom>>,
        ): void;
        setUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.SetUUIDMetadataParameters<Custom>,
        ): Promise<Webpubsub.SetUUIDMetadataResponse<Custom>>;

        removeUUIDMetadata(callback: Callback<Webpubsub.RemoveUUIDMetadataResponse>): void;
        removeUUIDMetadata(params?: Webpubsub.RemoveUUIDMetadataParameters): Promise<Webpubsub.RemoveUUIDMetadataResponse>;
        removeUUIDMetadata(
            params: Webpubsub.RemoveUUIDMetadataParameters,
            callback: Callback<Webpubsub.RemoveUUIDMetadataResponse>,
        ): void;

        getAllUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            callback: Callback<Webpubsub.GetAllUUIDMetadataResponse<Custom>>,
        ): void;
        getAllUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params?: Webpubsub.GetAllMetadataParameters,
        ): Promise<Webpubsub.GetAllUUIDMetadataResponse<Custom>>;
        getAllUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.GetAllMetadataParameters,
            callback: Callback<Webpubsub.GetAllUUIDMetadataResponse<Custom>>,
        ): void;

        getUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            callback: Callback<Webpubsub.GetUUIDMetadataResponse<Custom>>,
        ): void;
        getUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params?: Webpubsub.GetUUIDMetadataParameters,
        ): Promise<Webpubsub.GetUUIDMetadataResponse<Custom>>;
        getUUIDMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.GetUUIDMetadataParameters,
            callback: Callback<Webpubsub.GetUUIDMetadataResponse<Custom>>,
        ): void;

        // Channel Metadata
        setChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.SetChannelMetadataParameters<Custom>,
            callback: Callback<Webpubsub.SetChannelMetadataResponse<Custom>>,
        ): void;
        setChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.SetChannelMetadataParameters<Custom>,
        ): Promise<Webpubsub.SetChannelMetadataResponse<Custom>>;

        removeChannelMetadata(
            params: Webpubsub.RemoveChannelMetadataParameters,
            callback: Callback<Webpubsub.RemoveChannelMetadataResponse>,
        ): void;
        removeChannelMetadata(
            params: Webpubsub.RemoveChannelMetadataParameters,
        ): Promise<Webpubsub.RemoveChannelMetadataResponse>;

        getAllChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            callback: Callback<Webpubsub.GetAllChannelMetadataResponse<Custom>>,
        ): void;
        getAllChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params?: Webpubsub.GetAllMetadataParameters,
        ): Promise<Webpubsub.GetAllChannelMetadataResponse<Custom>>;
        getAllChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.GetAllMetadataParameters,
            callback: Callback<Webpubsub.GetAllChannelMetadataResponse<Custom>>,
        ): void;

        getChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.GetChannelMetadataParameters,
            callback: Callback<Webpubsub.GetChannelMetadataResponse<Custom>>,
        ): void;
        getChannelMetadata<Custom extends Webpubsub.ObjectCustom = Webpubsub.ObjectCustom>(
            params: Webpubsub.GetChannelMetadataParameters,
        ): Promise<Webpubsub.GetChannelMetadataResponse<Custom>>;

        // Memberships
        getMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            callback: Callback<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>,
        ): void;
        getMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params?: Webpubsub.GetMembershipsParametersv2,
        ): Promise<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>;
        getMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.GetMembershipsParametersv2,
            callback: Callback<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>,
        ): void;

        setMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.SetMembershipsParameters<ChannelCustom>,
            callback: Callback<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>,
        ): void;
        setMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.SetMembershipsParameters<ChannelCustom>,
        ): Promise<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>;

        removeMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.RemoveMembershipsParameters,
            callback: Callback<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>,
        ): void;
        removeMemberships<MembershipCustom extends Webpubsub.ObjectCustom, ChannelCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.RemoveMembershipsParameters,
        ): Promise<Webpubsub.ManageMembershipsResponse<MembershipCustom, ChannelCustom>>;

        getChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.GetChannelMembersParameters,
            callback: Callback<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>,
        ): void;
        getChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.GetChannelMembersParameters,
        ): Promise<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>;

        setChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.SetChannelMembersParameters<MembershipCustom>,
            callback: Callback<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>,
        ): void;
        setChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.SetChannelMembersParameters<MembershipCustom>,
        ): Promise<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>;

        removeChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.RemoveChannelMembersParameters,
            callback: Callback<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>,
        ): void;
        removeChannelMembers<MembershipCustom extends Webpubsub.ObjectCustom, UUIDCustom extends Webpubsub.ObjectCustom>(
            params: Webpubsub.RemoveChannelMembersParameters,
        ): Promise<Webpubsub.ManageChannelMembersResponse<MembershipCustom, UUIDCustom>>;
    };

    // message actions

    addMessageAction(
        params: Webpubsub.AddMessageActionParameters,
        callback: Callback<{ data: Webpubsub.MessageAction }>,
    ): void;

    addMessageAction(params: Webpubsub.AddMessageActionParameters): Promise<{ data: Webpubsub.MessageAction }>;

    removeMessageAction(params: Webpubsub.RemoveMessageActionParameters, callback: Callback<{ data: {} }>): void;

    removeMessageAction(params: Webpubsub.RemoveMessageActionParameters): Promise<{ data: {} }>;

    getMessageActions(
        params: Webpubsub.GetMessageActionsParameters,
        callback: Callback<Webpubsub.GetMessageActionsResponse>,
    ): void;

    getMessageActions(params: Webpubsub.GetMessageActionsParameters): Promise<Webpubsub.GetMessageActionsResponse>;

    // utilities

    encrypt(data: string, customCipherKey?: string, options?: Webpubsub.CryptoParameters): string;

    decrypt(data: string | object, customCipherKey?: string, options?: Webpubsub.CryptoParameters): any;

    time(): Promise<Webpubsub.FetchTimeResponse>;

    time(callback: Callback<Webpubsub.FetchTimeResponse>): void;
}

declare namespace Webpubsub {
    interface WebpubsubConfig {
        subscribeKey: string;
        uuid: string;
        publishKey?: string | undefined;
        cipherKey?: string | undefined;
        authKey?: string | undefined;
        logVerbosity?: boolean | undefined;
        ssl?: boolean | undefined;
        origin?: string | string[] | undefined;
        presenceTimeout?: number | undefined;
        heartbeatInterval?: number | undefined;
        restore?: boolean | undefined;
        keepAlive?: boolean | undefined;
        keepAliveSettings?: {
            keepAliveMsecs?: number | undefined;
            freeSocketKeepAliveTimeout?: number | undefined;
            timeout?: number | undefined;
            maxSockets?: number | undefined;
            maxFreeSockets?: number | undefined;
        } | undefined;
        subscribeRequestTimeout?: number | undefined;
        suppressLeaveEvents?: boolean | undefined;
        secretKey?: string | undefined;
        requestMessageCountThreshold?: number | undefined;
        autoNetworkDetection?: boolean | undefined;
        listenToBrowserNetworkEvents?: boolean | undefined;
        useRandomIVs?: boolean | undefined;
    }

    interface MessageEvent {
        channel: string;
        subscription: string;
        timetoken: string;
        message: any;
        publisher: string;

        /**
         * deprecated:
         */
        actualChannel: string;

        /**
         * deprecated:
         */
        subscribedChannel: string;
    }

    // WebpubsubData was renamed to MessageEvent, keep old name for backwards compatibility
    type WebpubsubData = MessageEvent;

    interface StatusEvent {
        category: string; // see Webpubsub.Categories
        operation: string; // see Webpubsub.Operations
        affectedChannels: string[];
        subscribedChannels: string[];
        affectedChannelGroups: string[];
        lastTimetoken: number | string;
        currentTimetoken: number | string;
    }

    interface PresenceEvent {
        action: 'join' | 'leave' | 'state-change' | 'timeout';
        channel: string;
        occupancy: number;
        state?: any;
        subscription: string;
        timestamp: number;
        timetoken: string;
        uuid: string;

        /**
         * deprecated:
         */
        actualChannel: string;
        /**
         * deprecated:
         */
        subscribedChannel: string;
    }

    interface SignalEvent {
        channel: string;
        subscription: string;
        timetoken: string;
        message: any;
        publisher: string;
    }

    interface MessageActionEvent {
        channel: string;
        publisher: string;
        subscription?: string | undefined;
        timetoken: string;
        event: string;
        data: MessageAction;
    }

    interface FileEvent {
        channel: string;
        subscription: string;
        publisher: string;
        timetoken: string;
        message: any;
        file: {
            id: string;
            name: string;
            url: string;
        };
    }

    interface BaseObjectsEvent {
        channel: string;
        message: {
            event: 'set' | 'delete';
            type: 'uuid' | 'channel' | 'membership';
            data: object;
        };
        subscription: string | null;
        publisher?: string | undefined;
        timetoken: number;
    }

    interface SetUUIDMetadataEvent<UUIDCustom extends ObjectCustom> extends BaseObjectsEvent {
        message: {
            event: 'set';
            type: 'uuid';
            data: UUIDMetadataObject<UUIDCustom>;
        };
    }

    interface RemoveUUIDMetadataEvent extends BaseObjectsEvent {
        message: {
            event: 'delete';
            type: 'uuid';
            data: { id: string };
        };
    }

    interface SetChannelMetadataEvent<ChannelCustom extends ObjectCustom> extends BaseObjectsEvent {
        message: {
            event: 'set';
            type: 'channel';
            data: ChannelMetadataObject<ChannelCustom>;
        };
    }

    interface RemoveChannelMetadataEvent extends BaseObjectsEvent {
        message: {
            event: 'delete',
            type: 'channel',
            data: { id: string };
        };
    }

    interface SetMembershipEvent<MembershipCustom extends ObjectCustom> extends BaseObjectsEvent {
        message: {
            event: 'set';
            type: 'membership';
            data: {
                channel: {
                    id: string;
                };
                uuid: {
                    id: string;
                };
                custom: MembershipCustom | null;
                updated: string;
                eTag: string;
            };
        };
    }

    interface RemoveMembershipEvent extends BaseObjectsEvent {
        message: {
            event: 'delete';
            type: 'membership';
            data: {
                channel: {
                    id: string;
                };
                uuid: {
                    id: string;
                };
            };
        };
    }

    type ObjectsEvent<
        UUIDCustom extends ObjectCustom = ObjectCustom,
        ChannelCustom extends ObjectCustom = ObjectCustom,
        MembershipCustom extends ObjectCustom = ObjectCustom,
        > =
        SetUUIDMetadataEvent<UUIDCustom> |
        RemoveUUIDMetadataEvent |
        SetChannelMetadataEvent<ChannelCustom> |
        RemoveChannelMetadataEvent |
        SetMembershipEvent<MembershipCustom> |
        RemoveMembershipEvent;

    // publish
    interface PublishParameters {
        message: any;
        channel: string;
        storeInHistory?: boolean | undefined;
        sendByPost?: boolean | undefined;
        meta?: any;
        ttl?: number | undefined;
    }

    interface PublishResponse {
        timetoken: number;
    }

    // signal

    interface SignalParameters {
        message: any;
        channel: string;
    }

    interface SignalResponse {
        timetoken: number;
    }

    interface HistoryParameters {
        channel: string;
        count: number;
        stringifiedTimeToken?: boolean | undefined;
        includeTimetoken?: boolean | undefined;
        reverse?: boolean | undefined;
        start?: string | number | undefined; // timetoken
        end?: string | number | undefined; // timetoken
        includeMeta?: boolean | undefined;
    }

    interface HistoryMessage {
        entry: any;
        timetoken?: string | number | undefined;
        meta?: object | undefined;
    }

    interface HistoryResponse {
        endTimeToken?: string | number | undefined;
        startTimeToken?: string | number | undefined;
        messages: HistoryMessage[];
    }

    interface FetchMessagesParameters {
        channels: string[];
        count?: number | undefined;
        stringifiedTimeToken?: boolean | undefined;
        start?: string | number | undefined; // timetoken
        end?: string | number | undefined; // timetoken
        withMessageActions?: boolean | undefined;
        includeMessageType?: boolean | undefined;
        includeUUID?: boolean | undefined;
        includeMeta?: boolean | undefined;
        includeMessageActions?: boolean | undefined;
    }

    interface FetchMessagesResponse {
        channels: {
            [channel: string]: Array<{
                channel: string;
                message: any;
                timetoken: string | number;
                messageType?: string | number | undefined;
                uuid?: string | undefined;
                meta?: {
                    [key: string]: any;
                } | undefined;
                actions: {
                    [type: string]: {
                        [value: string]: Array<{
                            uuid: string;
                            actionTimetoken: string | number; // timetoken
                        }>;
                    };
                };
            }>;
        };
    }

    interface DeleteMessagesParameters {
        channel: string;
        start?: string | number | undefined; // timetoken
        end?: string | number | undefined; // timetoken
    }

    interface MessageCountsParameters {
        channels: string[];
        channelTimetokens: string[] | number[];
    }

    interface MessageCountsResponse {
        channels: {
            [channel: string]: number;
        };
    }

    interface Push {
        addChannels(params: PushChannelParameters, callback: StatusCallback): void;

        addChannels(params: PushChannelParameters): Promise<void>;

        listChannels(params: PushDeviceParameters, callback: Callback<PushListChannelsResponse>): void;

        listChannels(params: PushDeviceParameters): Promise<PushListChannelsResponse>;

        removeChannels(params: PushChannelParameters, callback: StatusCallback): void;

        removeChannels(params: PushChannelParameters): Promise<void>;

        deleteDevice(params: PushDeviceParameters, callback: StatusCallback): void;

        deleteDevice(params: PushDeviceParameters): Promise<void>;
    }

    interface PushChannelParameters {
        channels: string[];
        device: string;
        pushGateway: string;
    }

    interface PushDeviceParameters {
        device: string;
        pushGateway: string;
    }

    interface PushListChannelsResponse {
        channels: string[];
    }

    interface WebpubsubStatus {
        error: boolean;
        category?: string | undefined; // see Webpubsub.Categories
        operation: string; // see Webpubsub.Operations
        statusCode: number;
        errorData?: Error | undefined;
    }

    // fire
    interface FireParameters {
        message: any;
        channel: string;
        sendByPost?: boolean | undefined;
        meta?: any;
    }

    // subscribe
    interface SubscribeParameters {
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
        withPresence?: boolean | undefined;
        timetoken?: number | undefined;
    }

    // unsubscribe
    interface UnsubscribeParameters {
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
    }

    // channelGroups
    interface ChannelGroups {
        addChannels(params: AddChannelParameters, callback: StatusCallback): void;

        addChannels(params: AddChannelParameters): Promise<{}>;

        removeChannels(params: RemoveChannelParameters, callback: StatusCallback): void;

        removeChannels(params: RemoveChannelParameters): Promise<{}>;

        listChannels(params: ListChannelsParameters, callback: Callback<ListChannelsResponse>): void;

        listChannels(params: ListChannelsParameters): Promise<ListChannelsResponse>;

        listGroups(callback: Callback<ListAllGroupsResponse>): void;

        listGroups(): Promise<ListAllGroupsResponse>;

        deleteGroup(params: DeleteGroupParameters, callback: StatusCallback): void;

        deleteGroup(params: DeleteGroupParameters): Promise<{}>;
    }

    interface AddChannelParameters {
        channels: string[];
        channelGroup: string;
    }

    interface RemoveChannelParameters {
        channels: string[];
        channelGroup: string;
    }

    interface ListChannelsParameters {
        channelGroup: string;
    }

    interface DeleteGroupParameters {
        channelGroup: string;
    }

    interface ListAllGroupsResponse {
        groups: string[];
    }

    interface ListChannelsResponse {
        channels: string[];
    }

    // addListener
    interface ListenerParameters {
        status?(statusEvent: StatusEvent): void;

        message?(messageEvent: MessageEvent): void;

        presence?(presenceEvent: PresenceEvent): void;

        signal?(signalEvent: SignalEvent): void;

        messageAction?(messageActionEvent: MessageActionEvent): void;

        file?(fileEvent: FileEvent): void;

        objects?(objectsEvent: ObjectsEvent): void;
    }

    // hereNow
    interface HereNowParameters {
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
        includeUUIDs?: boolean | undefined;
        includeState?: boolean | undefined;
    }

    interface HereNowResponse {
        totalChannels: number;
        totalOccupancy: number;
        channels: {
            [channel: string]: {
                name: string;
                occupancy: number;
                occupants: Array<{
                    uuid: string;
                    state?: any;
                }>;
            };
        };
    }

    // whereNow
    interface WhereNowParameters {
        uuid?: string | undefined;
    }

    interface WhereNowResponse {
        channels: string[];
    }

    // setState
    interface SetStateParameters {
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
        state?: any;
    }

    interface SetStateResponse {
        state: any;
    }

    // getState
    interface GetStateParameters {
        uuid?: string | undefined;
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
    }

    interface GetStateResponse {
        channels: {
            [channel: string]: any;
        };
    }

    // grant
    interface GrantParameters {
        channels?: string[] | undefined;
        channelGroups?: string[] | undefined;
        uuids?: string[] | undefined;
        authKeys?: string[] | undefined;
        ttl?: number | undefined;
        read?: boolean | undefined;
        write?: boolean | undefined;
        manage?: boolean | undefined;
        delete?: boolean | undefined;
        get?: boolean | undefined;
        join?: boolean | undefined;
        update?: boolean | undefined;
    }

    // grantToken

    interface GrantTokenParameters {
        ttl: number;
        authorized_uuid?: string | undefined;
        resources?: {
            channels?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
            groups?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
            uuids?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
        };
        patterns?: {
            channels?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
            groups?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
            uuids?: {
                [key: string]: GrantTokenPermissions;
            } | undefined;
        };
        meta?: {
            [key: string]: any;
        } | undefined;
    }

    interface ParsedGrantToken extends GrantTokenParameters {
        version: number;
        timestamp: number;
        signature: any;
    }

    interface GrantTokenPermissions {
        read?: boolean;
        write?: boolean;
        manage?: boolean;
        delete?: boolean;
        get?: boolean;
        join?: boolean;
        update?: boolean;
    }

    interface RevokeTokenResponse {
        status: number;
        data: object;
    }

    // message actions
    interface AddMessageActionParameters {
        channel: string;
        messageTimetoken: string;
        action: {
            type: string;
            value: string;
        };
    }

    interface MessageAction {
        type: string;
        value: string;
        uuid: string;
        actionTimetoken: string;
        messageTimetoken: string;
    }

    interface RemoveMessageActionParameters {
        channel: string;
        messageTimetoken: string;
        actionTimetoken: string;
    }

    interface GetMessageActionsParameters {
        channel: string;
        start?: string | undefined;
        end?: string | undefined;
        limit?: number | undefined;
    }

    interface GetMessageActionsResponse {
        data: MessageAction[];
        start?: string | undefined;
        end?: string | undefined;
    }
    // files
    interface ListFilesParameters {
        channel: string;
        limit?: number | undefined;
        next?: string | undefined;
    }
    interface SendFileParameters {
        channel: string;
        file: StreamFileInput | BufferFileInput | UriFileInput;
        message?: any;
        cipherKey?: string | undefined;
        storeInHistory?: boolean | undefined;
        ttl?: number | undefined;
        meta?: any;
    }

    interface StreamFileInput {
        stream: any;
        name: string;
        mimeType?: string | undefined;
    }

    interface BufferFileInput {
        data: any;
        name: string;
        mimeType?: string | undefined;
    }

    interface UriFileInput {
        uri: string;
        name: string;
        mimeType?: string | undefined;
    }

    interface DownloadFileParameters {
        channel: string;
        id: string;
        name: string;
        cipherKey?: string | undefined;
    }

    interface FileInputParameters {
        channel: string;
        id: string;
        name: string;
    }

    interface PublishFileParameters {
        channel: string;
        message?: any;
        fileId: string;
        fileName: string;
        storeInHistory?: boolean | undefined;
        ttl?: number | undefined;
        meta?: any;
    }

    interface ListFilesResponse {
        status: number;
        data: Array<{
          name: string;
          id: string;
          size: number;
          created: string;
        }>;
        next: string;
        count: number;
      }

    interface SendFileResponse {
        timetoken: string;
        name: string;
        id: string;
      }

    interface DeleteFileResponse {
        status: number;
    }

    interface PublishFileResponse {
        timetoken: string;
    }

    // Objects v2

    // Object
    interface ObjectCustom {
        [key: string]: string | number | boolean;
    }

    interface v2ObjectData<Custom extends ObjectCustom> {
        id: string;
        eTag: string;
        updated: string;
        custom?: Custom | null | undefined;
    }

    interface v2ObjectParam<Custom extends ObjectCustom> {
        custom?: Custom | undefined;
    }

    // UUID metadata
    interface UUIDMetadataFields {
        name: string;
        externalId: string;
        profileUrl: string;
        email: string;
    }

    interface UUIDMetadata<Custom extends ObjectCustom> extends v2ObjectParam<Custom>, Partial<UUIDMetadataFields> { }

    interface UUIDMetadataObject<Custom extends ObjectCustom> extends v2ObjectData<Custom>, Nullable<UUIDMetadataFields> { }

    interface SetUUIDMetadataParameters<Custom extends ObjectCustom> {
        uuid?: string | undefined;
        data: UUIDMetadata<Custom>;
        include?: {
            customFields?: boolean | undefined;
        } | undefined;
    }

    type SetUUIDMetadataResponse<Custom extends ObjectCustom> = ObjectsResponse<UUIDMetadataObject<Custom>>;

    interface RemoveUUIDMetadataParameters {
        uuid?: string | undefined;
    }

    type RemoveUUIDMetadataResponse = ObjectsResponse<{}>;

    interface GetAllMetadataParameters {
        include?: {
            totalCount?: boolean | undefined;
            customFields?: boolean | undefined;
        } | undefined;
        filter?: string | undefined;
        sort?: object | undefined;
        limit?: number | undefined;
        page?: {
            next?: string | undefined;
            prev?: string | undefined;
        } | undefined;
    }

    type GetAllUUIDMetadataResponse<Custom extends ObjectCustom> = PagedObjectsResponse<UUIDMetadataObject<Custom>>;

    interface GetUUIDMetadataParameters {
        uuid?: string | undefined;
        include?: {
            customFields?: boolean | undefined;
        } | undefined;
    }

    type GetUUIDMetadataResponse<Custom extends ObjectCustom> = ObjectsResponse<UUIDMetadataObject<Custom>>;

    // Channel Metadata

    interface ChannelMetadataFields {
        name: string;
        description: string;
    }

    interface ChannelMetadata<Custom extends ObjectCustom> extends v2ObjectParam<Custom>, Partial<ChannelMetadataFields> { }

    interface ChannelMetadataObject<Custom extends ObjectCustom> extends v2ObjectData<Custom>, Nullable<ChannelMetadataFields> { }

    interface SetChannelMetadataParameters<Custom extends ObjectCustom> {
        channel: string;
        data: ChannelMetadata<Custom>;
        include?: {
            customFields?: boolean | undefined;
        } | undefined;
    }

    type SetChannelMetadataResponse<Custom extends ObjectCustom> = ObjectsResponse<ChannelMetadataObject<Custom>>;

    interface RemoveChannelMetadataParameters {
        channel: string;
    }

    type RemoveChannelMetadataResponse = ObjectsResponse<{}>;

    type GetAllChannelMetadataResponse<Custom extends ObjectCustom> = PagedObjectsResponse<
        ChannelMetadataObject<Custom>
    >;

    interface GetChannelMetadataParameters {
        channel: string;
        include?: {
            customFields: boolean;
        } | undefined;
    }

    type GetChannelMetadataResponse<Custom extends ObjectCustom> = ObjectsResponse<ChannelMetadataObject<Custom>>;

    // Memberships

    interface UUIDMembershipObject<MembershipCustom extends ObjectCustom, UUIDCustom extends ObjectCustom> extends Omit<v2ObjectData<MembershipCustom>, "id"> {
        uuid: UUIDMetadataObject<UUIDCustom> | { id: string };
    }

    interface ChannelMembershipObject<MembershipCustom extends ObjectCustom, ChannelCustom extends ObjectCustom> extends Omit<v2ObjectData<MembershipCustom>, "id"> {
        channel: ChannelMetadataObject<ChannelCustom> | { id: string };
    }

    interface UUIDMembersParameters {
        include?: {
            totalCount?: boolean | undefined;
            customFields?: boolean | undefined;
            UUIDFields?: boolean | undefined;
            customUUIDFields?: boolean | undefined;
        } | undefined;
        filter?: string | undefined;
        sort?: object | undefined;
        limit?: number | undefined;
        page?: {
            next?: string | undefined;
            prev?: string | undefined;
        } | undefined;
    }

    interface ChannelMembersParameters {
        include?: {
            totalCount?: boolean | undefined;
            customFields?: boolean | undefined;
            channelFields?: boolean | undefined;
            customChannelFields?: boolean | undefined;
        } | undefined;
        filter?: string | undefined;
        sort?: object | undefined;
        limit?: number | undefined;
        page?: {
            next?: string | undefined;
            prev?: string | undefined;
        } | undefined;
    }

    interface GetChannelMembersParameters extends UUIDMembersParameters {
        channel: string;
    }

    type ManageChannelMembersResponse<
        MembershipCustom extends ObjectCustom,
        UUIDCustom extends ObjectCustom,
        > = PagedObjectsResponse<UUIDMembershipObject<MembershipCustom, UUIDCustom>>;
    type ManageMembershipsResponse<
        MembershipCustom extends ObjectCustom,
        ChannelCustom extends ObjectCustom,
        > = PagedObjectsResponse<ChannelMembershipObject<MembershipCustom, ChannelCustom>>;

    interface GetMembershipsParametersv2 extends ChannelMembersParameters {
        uuid?: string | undefined;
    }

    interface SetCustom<Custom extends ObjectCustom> {
        id: string;
        custom?: Custom | undefined;
    }

    interface SetMembershipsParameters<Custom extends ObjectCustom> extends ChannelMembersParameters {
        uuid?: string | undefined;
        channels?: Array<string | SetCustom<Custom>> | undefined;
    }

    interface RemoveMembershipsParameters extends ChannelMembersParameters {
        uuid?: string | undefined;
        channels: string[];
    }

    interface SetChannelMembersParameters<Custom extends ObjectCustom> extends UUIDMembersParameters {
        channel: string;
        uuids: Array<string | SetCustom<Custom>>;
    }

    interface RemoveChannelMembersParameters extends UUIDMembersParameters {
        channel: string;
        uuids: string[];
    }

    // encrypt & decrypt
    interface CryptoParameters {
        encryptKey?: boolean | undefined;
        keyEncoding?: string | undefined;
        keyLength?: number | undefined;
        mode?: string | undefined;
    }

    // fetch time
    interface FetchTimeResponse {
        timetoken: number;
    }

    // APNS2
    interface APNS2Configuration {
        collapseId?: string | undefined;
        expirationDate?: Date | undefined;
        targets: APNS2Target[];
    }

    interface APNS2Target {
        topic: string;
        environment?: 'development' | 'production' | undefined;
        excludedDevices?: string[] | undefined;
    }
    // NotificationPayloads

    interface BaseNotificationPayload {
        subtitle?: string | undefined;
        payload: object;
        badge?: number | undefined;
        sound?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
    }

    interface APNSNotificationPayload extends BaseNotificationPayload {
        configurations: APNS2Configuration[];
        apnsPushType?: string | undefined;
        isSilent: boolean;
    }

    interface MPNSNotificationPayload extends BaseNotificationPayload {
        backContent?: string | undefined;
        backTitle?: string | undefined;
        count?: number | undefined;
        type?: string | undefined;
    }

    interface FCMNotificationPayload extends BaseNotificationPayload {
        isSilent: boolean;
        icon?: string | undefined;
        tag?: string | undefined;
    }

    interface NotificationsPayload {
        payload: { apns: object; mpns: object; fcm: object };
        debugging: boolean;
        subtitle?: string | undefined;
        badge?: number | undefined;
        sound?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
        apns: APNSNotificationPayload;
        mpns: MPNSNotificationPayload;
        fcm: FCMNotificationPayload;

        buildPayload(platforms: string[]): object;
    }

    interface Categories {
        WPSNetworkUpCategory: string;
        WPSNetworkDownCategory: string;
        WPSNetworkIssuesCategory: string;
        WPSTimeoutCategory: string;
        WPSBadRequestCategory: string;
        WPSAccessDeniedCategory: string;
        WPSUnknownCategory: string;
        WPSReconnectedCategory: string;
        WPSConnectedCategory: string;
        WPSRequestMessageCountExceedCategory: string;
        WPSMalformedResponseCategory: string;
    }

    interface Operations {
        WPSTimeOperation: string;
        WPSHistoryOperation: string;
        WPSDeleteMessagesOperation: string;
        WPSFetchMessagesOperation: string;
        WPSMessageCountsOperation: string;
        WPSSubscribeOperation: string;
        WPSUnsubscribeOperation: string;
        WPSPublishOperation: string;
        WPSPushNotificationEnabledChannelsOperation: string;
        WPSRemoveAllPushNotificationsOperation: string;
        WPSWhereNowOperation: string;
        WPSSetStateOperation: string;
        WPSHereNowOperation: string;
        WPSGetStateOperation: string;
        WPSHeartbeatOperation: string;
        WPSChannelGroupsOperation: string;
        WPSRemoveGroupOperation: string;
        WPSChannelsForGroupOperation: string;
        WPSAddChannelsToGroupOperation: string;
        WPSRemoveChannelsFromGroupOperation: string;
        WPSAccessManagerGrant: string;
        WPSAccessManagerAudit: string;
        WPSCreateUserOperation: string;
        WPSUpdateUserOperation: string;
        WPSDeleteUserOperation: string;
        WPSGetUsersOperation: string;
        WPSCreateSpaceOperation: string;
        WPSUpdateSpaceOperation: string;
        WPSDeleteSpaceOperation: string;
        WPSGetSpacesOperation: string;
        WPSGetMembershipsOperation: string;
        WPSGetMembersOperation: string;
        WPSUpdateMembershipsOperation: string;
        WPSAddMessageActionOperation: string;
        WPSRemoveMessageActionOperation: string;
        WPSGetMessageActionsOperation: string;
    }
}

export = Webpubsub;
