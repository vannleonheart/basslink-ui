import { createContext } from 'react';

export type AppContextType = Record<string, never>;

const AppContext = createContext<AppContextType>({});

export default AppContext;
