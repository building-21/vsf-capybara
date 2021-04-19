import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import config from 'config';
import { getContent } from './homepage';

export default interface PromotedOffersState {
  banners: {
    mainBanners: any[],
    smallBanners: any[],
    productBanners: any[],
    menuAsideBanners: any[]
  },
  headImage: any[]
}

export const promotedStore = {
  namespaced: true,
  state: {
    banners: {
      mainBanners: [],
      smallBanners: [],
      productBanners: [],
      menuAsideBanners: []
    },
    headImage: []
  },
  getters: {
    getPromotedOffers: state => {
      return state.banners
    },
    getHeadImage: state => state.headImage
  },
  actions: {
    async updatePromotedOffers ({ commit }) {
      try {
        // query the api for promoted images
        let url = config.images.baseUrl + 'promoted'
        const images = await getContent(url)
        commit('updatePromotedOffers', images)
      } catch (err) {
        Logger.debug('Unable to load promotedOffers ' + err)()
      }
    },
    async updateHeadImage ({ commit }) {
      try {
        // query the api for banner images
        let url = config.images.baseUrl + 'head'
        const images = await getContent(url)
        commit('SET_HEAD_IMAGE', images.images)
      } catch (err) {
        Logger.debug('Unable to load headImage ' + err)()
      }
    }
  },
  mutations: {
    updatePromotedOffers (state, data) {
      state.banners = data
    },
    SET_HEAD_IMAGE (state, headImage) {
      state.headImage = headImage
    }
  }
}
