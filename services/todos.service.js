const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const fake = require("fakerator")();

function generateFakeData(count) {
	let rows = [];

	for(let i = 0; i < count; i++) {
		let item = {
            id: i + 1,
            label: fake.lorem.sentence()
        };
		rows.push(item);
	}

	return rows;
}

module.exports = {

    name: "todos",
    actions: {
        list: {
            cache: true,
            handler(ctx) {
                return this.rows;
            }
        },
        get: {
            cache: {
                keys: ["id"]
            },
            handler(ctx) {
                const todo = this.findByID(ctx.params.id);
                if (todo) {
                    return todo;
                }

                return Promise.reject(new MoleculerError('Todo not found!', 404));
            }
        },
        create: {
            handler(ctx) {
                this.rows.push(ctx.params);
                this.clearCache();

                return this.rows[this.rows.length - 1];
            }
        },
        update: {
            handler(ctx) {
                const todo = this.findByID(ctx.params.id);
                if (todo) {
                    if (ctx.params.label) {
                        post.label = ctx.params.label;
                    }
                    this.clearCache();
                    return todo;
                }
                return Promise.reject(new MoleculerError("Todo not found!", 404));
            }
        },
        remove: {
            handler(ctx) {
                this.rows = this.rows.filter(row => row.id != ctx.params.id);
                this.clearCache();
            }
        }
    },
    methods: {
		findByID(id) {
			return this.rows.find(item => item.id == id);
		},

		clearCache() {
			this.broker.emitLocal("cache.clean", this.label + ".*");
		}
    },
    created() {
		this.logger.debug("Generate fake posts...");
		this.rows = generateFakeData(5);
	}

}