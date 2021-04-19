import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'
import { TaskQueue } from '@vue-storefront/core/lib/sync'

export const getContent = async (url): Promise<any> => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    const task = await TaskQueue.execute({ url,
      payload: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      }
    })
    return task.result;
  } catch (err) {
    console.error('error', err)
  }
}

export const homepageStore = {
  namespaced: true,
  state: {
    new_collection: [],
    bestsellers: []
  },
  actions: {
    async fetchNewCollection ({ commit, dispatch }) {
      const newProductsQuery = prepareQuery({ queryConfig: 'newProducts' })

      const newProductsResult = await dispatch('product/findProducts', {
        query: newProductsQuery,
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })
      const configuredProducts = await dispatch(
        'category-next/configureProducts',
        { products: newProductsResult.items
        }, { root: true })
      commit('SET_NEW_COLLECTION', configuredProducts)
    },
    async loadBestsellers ({ commit, dispatch }) {
      const response = await dispatch('product/findProducts', {
        query: prepareQuery({ queryConfig: 'bestSellers' }),
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })

      commit('SET_BESTSELLERS', response.items)
    }
  },
  mutations: {
    SET_NEW_COLLECTION (state, products) {
      state.new_collection = products || []
    },
    SET_BESTSELLERS (state, bestsellers) {
      state.bestsellers = bestsellers
    }
  },
  getters: {
    getEverythingNewCollection (state) {
      return state.new_collection
    },
    getBestsellers (state) {
      return state.bestsellers
    }
  }
}
