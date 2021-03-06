import {Query, Query_Implementation} from './query'
import {Collection_Trellis} from './types'
import {create, create_or_update, update} from './update'

export interface ICollection {
  get_sequelize(): any
}

export class Collection<T> implements ICollection {
  private sequelize
  private trellis: Collection_Trellis<T>

  constructor(trellis: Collection_Trellis<T>, sequelize_model) {
    this.trellis = trellis
    this.sequelize = sequelize_model
    trellis.collection = this
  }

  create(seed): Promise<T> {
    return create(seed, this.trellis, this.sequelize)
  }

  create_or_update(seed): Promise<T> {
    return create_or_update(seed, this.trellis, this.sequelize)
  }

  update(seed, changes?): Promise<T> {
    return update(seed, this.trellis, this.sequelize, changes)
  }

  remove(seed): Promise<T> {
    return this.sequelize.destroy({
      where: {
        [this.trellis.primary_keys[0].name]: this.trellis.get_identity(seed)
      }
    })
  }

  all(): Query<T> {
    return new Query_Implementation<T>(this.sequelize, this.trellis)
  }

  filter(options): Query<T> {
    return this.all().filter(options)
  }

  first(options?): Query<T> {
    return this.all().first(options)
  }

  first_or_null(options?): Query<T> {
    return this.all().first_or_null(options)
  }

  firstOrNull(options?): Query<T> {
    return this.all().first_or_null(options)
  }

  get_sequelize() {
    return this.sequelize
  }

  get(identity) {
    identity = this.trellis.get_identity(identity)
    const filter = {}
    filter[this.trellis.primary_key.name] = identity

    return this.filter(filter).first()
  }

}
