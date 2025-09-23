import _ from 'lodash';
import EventEmitter from './EventEmitter';
import { AuthType, User, AgentUser, ClientUser, AdminUser } from '@/types';

type TreeNode = {
	id: string;
	children?: TreeNode[];
};

class FuseUtils {
	static filterArrayByString<T>(mainArr: T[], searchText: string): T[] {
		if (!searchText || searchText?.length === 0 || !searchText) {
			return mainArr;
		}

		searchText = searchText?.toLowerCase();
		const filtered = mainArr.filter((itemObj) => this.searchInObj(itemObj, searchText));

		if (filtered.length === mainArr.length) {
			return mainArr;
		}

		return filtered;
	}

	static searchInObj(itemObj: unknown, searchText: string) {
		if (!isRecord(itemObj)) {
			return false;
		}

		const propArray = Object.keys(itemObj);

		function isRecord(value: unknown): value is Record<string, unknown> {
			return Boolean(value && typeof value === 'object' && !Array.isArray(value) && typeof value !== 'function');
		}

		for (const prop of propArray) {
			const value = itemObj[prop];

			if (typeof value === 'string') {
				if (this.searchInString(value, searchText)) {
					return true;
				}
			} else if (Array.isArray(value)) {
				if (this.searchInArray(value, searchText)) {
					return true;
				}
			}

			if (typeof value === 'object') {
				if (this.searchInObj(value, searchText)) {
					return true;
				}
			}
		}

		return false;
	}

	static searchInArray(arr: unknown[], searchText: string) {
		arr.forEach((value) => {
			if (typeof value === 'string') {
				if (this.searchInString(value, searchText)) {
					return true;
				}
			}

			if (value && typeof value === 'object') {
				if (this.searchInObj(value, searchText)) {
					return true;
				}
			}

			return false;
		});

		return false;
	}

	static searchInString(value: string, searchText: string) {
		return value.toLowerCase().includes(searchText);
	}

	static findById(tree: TreeNode[], idToFind: string): TreeNode | undefined {
		const node = _.find(tree, { id: idToFind });

		if (node) {
			return node;
		}

		let foundNode: TreeNode | undefined;

		_.some(tree, (item) => {
			if (item.children) {
				foundNode = this.findById(item.children, idToFind);
				return foundNode;
			}

			return false; // Continue iterating
		});

		return foundNode;
	}

	static EventEmitter = EventEmitter;

	static hasPermission(authTypes: AuthType, user: User): boolean {
		if (null === authTypes || undefined === authTypes) {
			return true;
		}

		if (typeof authTypes === 'boolean') {
			if (false === authTypes && !user) {
				return true;
			}

			return !!(true === authTypes && user);
		}

		if (typeof authTypes === 'string') {
			if (!authTypes.length) {
				return true;
			}

			if (authTypes === 'agent') {
				const agentUser = user as AgentUser;

				if (agentUser?.agent) {
					return true;
				}
			}

			if (authTypes === 'client') {
				const clientUser = user as ClientUser;

				if (clientUser?.client) {
					return true;
				}
			}

			if (authTypes === 'admin') {
				const adminUser = user as AdminUser;

				if (adminUser?.username) {
					return true;
				}
			}

			return false;
		}

		if (Array.isArray(authTypes)) {
			if (!authTypes.length) {
				return true;
			}

			if (user) {
				for (const currentAuthType of authTypes) {
					if (currentAuthType && typeof currentAuthType === 'string') {
						if (!currentAuthType.length) {
							return true;
						}

						if (currentAuthType === 'agent') {
							const agentUser = user as AgentUser;

							if (agentUser?.agent) {
								return true;
							}
						}

						if (currentAuthType === 'client') {
							const clientUser = user as ClientUser;

							if (clientUser?.client) {
								return true;
							}
						}

						if (currentAuthType === 'admin') {
							const adminUser = user as AdminUser;

							if (adminUser?.username) {
								return true;
							}
						}
					}

					if (currentAuthType && typeof currentAuthType === 'object') {
						const currentAuth = currentAuthType as { type: string; roles?: string | string[] };

						if (currentAuth.type === 'agent') {
							const agentUser = user as AgentUser;

							if (!agentUser?.agent) {
								return false;
							}

							const roles = currentAuth.roles;

							if (!roles) {
								return true;
							}

							if (typeof roles === 'string' && roles === user?.role) {
								return true;
							}

							if (Array.isArray(roles) && roles.includes(user?.role)) {
								return true;
							}
						}

						if (currentAuth.type === 'client') {
							const clientUser = user as ClientUser;

							if (!clientUser?.client) {
								return false;
							}

							const roles = currentAuth.roles;

							if (!roles) {
								return true;
							}

							if (typeof roles === 'string' && roles === user?.role) {
								return true;
							}

							if (Array.isArray(roles) && roles.includes(user?.role)) {
								return true;
							}
						}

						if (currentAuth.type === 'admin') {
							const adminUser = user as AdminUser;

							if (!adminUser?.username) {
								return false;
							}

							const roles = currentAuth.roles;

							if (!roles) {
								return true;
							}

							if (typeof roles === 'string' && roles === user?.role) {
								return true;
							}

							if (Array.isArray(roles) && roles.includes(user?.role)) {
								return true;
							}
						}
					}
				}
			}
		}

		return false;
	}

	static filterRecursive(data: [] | null, predicate: (arg0: unknown) => boolean) {
		return !data
			? null
			: data.reduce((list: unknown[], entry: { children?: [] }) => {
					let clone: unknown = null;

					if (predicate(entry)) {
						clone = { ...entry };
					}

					if (entry.children != null) {
						const children = this.filterRecursive(entry.children, predicate);

						if (children && children?.length > 0) {
							clone = { ...entry, children };
						}
					}

					if (clone) {
						list.push(clone);
					}

					return list;
				}, []);
	}
}

export default FuseUtils;
