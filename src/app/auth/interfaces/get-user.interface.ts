export interface GetUserGeneralResponse {
    isSuccess: boolean;
    status:    string;
    message:   string;
    data:      GetUserResponse;
}

export interface GetUserResponse {
    userId:                number;
    username:              string;
    password:              null;
    accountNonExpired:     boolean;
    accountNonLocked:      boolean;
    credentialsNonExpired: boolean;
    roles:                 Role[];
    enable:                boolean;
}

export interface Role {
    roleId:          number;
    roleName:        string;
    rolePermissions: RolePermission[];
}

export interface RolePermission {
    permissionId:   number;
    permissionName: string;
}
