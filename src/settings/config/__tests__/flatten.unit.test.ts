import { expect } from 'chai'
import { FMap } from '../../../util/map'
import { FlatConfig, ConfigPositionInfo } from '../types'
import { normalizeConfig, flattenConfig } from '../'
import * as testingConfigs from '../../../../testing/resources/testing-configs'

describe(__filename, () => {
  const galleryPostImgTag = testingConfigs.GALLERY_POST_IMG_TAG

  it('matches expected flat config', () => {
    const fullConfig = normalizeConfig(galleryPostImgTag)
    const configForPieces = fullConfig as any
    const flatConfigGuess: FlatConfig = FMap.fromObject<ConfigPositionInfo>({
      gallery: {
        depth: 0,
        horizontalIndex: 0,
        name: 'gallery',
        parentName: undefined,
        configAtPosition: configForPieces.flow[0]
      },
      post: {
        depth: 1,
        horizontalIndex: 0,
        name: 'post',
        parentName: 'gallery',
        configAtPosition: configForPieces.flow[1]
      },
      'img-parse': {
        depth: 2,
        horizontalIndex: 1,
        name: 'img-parse',
        parentName: 'post',
        configAtPosition: configForPieces.flow[1].branch[1][0]
      },
      img: {
        depth: 3,
        horizontalIndex: 0,
        name: 'img',
        parentName: 'img-parse',
        configAtPosition: configForPieces.flow[1].branch[1][1]
      },
      tag: {
        depth: 2,
        horizontalIndex: 0,
        name: 'tag',
        parentName: 'post',
        configAtPosition: configForPieces.flow[1].branch[0][0]
      }
    })
    const flatConfig = flattenConfig(fullConfig)
    expect([...flatConfig]).to.have.deep.members([...flatConfigGuess])
  })
})