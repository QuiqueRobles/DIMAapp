// __mocks__/isOwner.ts
export const useSession = () => ({ session: null });
export const IsOwnerProvider = ({ children }: { children: React.ReactNode }) => children;