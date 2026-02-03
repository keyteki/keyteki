export type Permission =
    | 'canEditNews'
    | 'canManageUsers'
    | 'canManagePermissions'
    | 'canManageGames'
    | 'canManageNodes'
    | 'canModerateChat'
    | 'canVerifyDecks'
    | 'canManageBanlist'
    | 'canManageMotd'
    | 'canManageTournaments'
    | 'isAdmin'
    | 'isContributor'
    | 'isSupporter'
    | 'isWinner';

export interface UserSummary {
    id?: string;
    username: string;
    role?: string;
    avatar?: string;
    permissions?: Partial<Record<Permission, boolean>>;
}

export interface LobbyMessage {
    id?: number | string;
    message: string;
    time: string | Date;
    user: UserSummary;
    deleted?: boolean;
    deletedBy?: string;
}

export interface MotdMessage {
    message?: string;
    motdType?: string;
}

export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}

export interface ApiRequestState {
    loading?: boolean;
    status?: number;
    error?: string | null;
}

export interface LobbyState {
    bannerNotice?: string;
    lobbyError?: boolean;
    messages: LobbyMessage[];
    motd?: MotdMessage;
    users: UserSummary[];
    socket?: unknown;
    connected?: boolean;
    connecting?: boolean;
}

export interface AccountState {
    user?: UserSummary | null;
}

export interface NewsItem {
    id?: string;
    title?: string;
    body?: string;
    createdAt?: string | Date;
}

export interface NewsState {
    news: NewsItem[];
}

export interface RootState {
    lobby: LobbyState;
    account: AccountState;
    news: NewsState;
    api: Record<string, ApiRequestState>;
}
