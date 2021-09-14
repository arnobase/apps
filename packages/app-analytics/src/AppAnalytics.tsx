import styled, {createGlobalStyle} from 'styled-components'
import {BlackCard, Chart, Chart2, Map} from './components'

const Root = styled.div`
  width: 100%;
  margin: 30px;
  box-sizing: border-box;
`

const HideBMapIcon = createGlobalStyle`
  .BMap_cpyCtrl,
  .anchorBL {
    display: none;
  }
`

export const AppAnalytics = () => (
  <>
    <HideBMapIcon></HideBMapIcon>
    <Root>
      <h2>Map</h2>

      <Map></Map>

      <h2>Chart</h2>

      <div style={{display: 'flex', gap: 12}}>
        <BlackCard>
          <Chart></Chart>
        </BlackCard>
        <BlackCard>
          <Chart2></Chart2>
        </BlackCard>
      </div>
    </Root>
  </>
)
