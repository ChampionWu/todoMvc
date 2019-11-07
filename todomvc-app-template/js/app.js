(function (Vue) {
	// const items = [
	// 	{
	// 		id: 1,
	// 		content: 'java',
	// 		completed: true,

	// 	},
	// 	{
	// 		id: 2,
	// 		content: 'php',
	// 		completed: true,

	// 	},
	// 	{
	// 		id: 3,
	// 		content: 'python',
	// 		completed: false,

	// 	}
	// ];
	//获取焦点
	Vue.directive('app-focus', {
		inserted(el, binding) {
			el.focus();
		}
	});
	const ITEMSKEY = 'item-key';
	const itemStorage = {
		fetch() {
			return JSON.parse(window.localStorage.getItem(ITEMSKEY));
		},
		save(newItem) {
			window.localStorage.setItem(ITEMSKEY, JSON.stringify(newItem));
		}
	}
	const app = new Vue({
		el: '#todoApp',
		data: {
			items: itemStorage.fetch(),
			currentItem: null,
			hash: 'all',
		},

		computed: {
			filterItems() {
				switch (this.hash) {
					case 'active':
						return this.items.filter(item => !item.completed);
						break;
					case 'completed':
						return this.items.filter(item => item.completed);
						break;
					default:
						return this.items
						break;
				}
			},
			remaining() {
				const unitems = this.items.filter((item) => {
					return !item.completed
				})
				return unitems.length;
			},
			toggleAll: {
				get() {
					return this.remaining === 0;
				},
				set(newState) {
					this.items.forEach(element => {
						element.completed = newState;
					});
				}
			}
		},
		//局部指令获取焦点
		directives: {
			'todo-focus': {
				update(el, binding) {
					if (binding.value) {
						el.focus();
					}
				}
			}
		},
		methods: {
			addItem(e) {
				const content = e.target.value.trim()
				if (!content) {
					return;
				}
				const id = this.items.length + 1;
				this.items.push(
					{
						id,
						content,
						completed: false,
					}
				)
				e.target.value = '';
			},
			deleteItem(index) {
				this.items.splice(index, 1);
			},
			clearCompleted() {
				this.items = this.items.filter(item =>
					!item.completed
				)
			},
			toEdit(item) {
				console.log(item);

				// this.currentItem = item;
				this.currentItem = item;
				console.log(this.currentItem);

			},
			cancelEdit() {
				this.currentItem = null;
			},
			finishEdit(index, e) {
				const content = e.target.value.trim();
				if (!content) {
					this.deleteItem(index);
					return;
				}
				this.currentItem.content = content;
				this.cancelEdit();
			}
		},
		watch: {
			items: {
				handler: (newItem) => {
					itemStorage.save(newItem)
				},
				deep: true
			}
		}

	})
	window.onhashchange = () => {
		let hash = window.location.hash.substr(2) || 'all';
		console.log(hash);
		app.hash = hash;
	}
	//载入页面先调用一次
	window.onhashchange();
})(Vue);
