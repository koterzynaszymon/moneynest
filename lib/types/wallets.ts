import { Database } from "./database";

export type Wallets = Database["public"]["Tables"]["wallets"]["Row"];
export type NewWallet = Database["public"]["Tables"]["wallets"]["Insert"];
export type UpdatedWallet = Database["public"]["Tables"]["wallets"]["Update"];