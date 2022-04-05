import { UserRoleEnum } from "../Enums/UserRoleEnum";

export interface PlayerDTO {
  name: string;
  id: string;
  role?: UserRoleEnum;
  avatar: string;
}
