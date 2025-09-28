import _ from 'lodash';
import EventEmitter from './EventEmitter';
import { AuthType, UserType } from '@/types';

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

	static hasPermission(auth: AuthType, user: UserType): boolean {
		if (null === auth || undefined === auth) {
			return true;
		}

		if (typeof auth === 'boolean') {
			if (false === auth && !user) {
				return true;
			}

			return !!(true === auth && user);
		}

		if (typeof auth === 'string') {
			if (!auth.length) {
				return true;
			}

			if (user && user?.as.includes(auth)) {
				return true;
			}

			if (!user && auth === 'guest') {
				return true;
			}

			return false;
		}

		if (Array.isArray(auth)) {
			if (!auth.length) {
				return true;
			}

			for (const currentAuth of auth) {
				if (currentAuth && typeof currentAuth === 'string') {
					if (!currentAuth.length) {
						continue;
					}

					if (!user && currentAuth === 'guest') {
						return true;
					}

					if (user && user?.as.includes(currentAuth)) {
						return true;
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
