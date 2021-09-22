import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

function Chart(props) {
    let res = props.data.map((stock) => ({
        x: stock.date,
        y: stock.close,
    }));

    return (
        <div>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
            >
                <VictoryAxis
                    style={{
                        axis: { stroke: '#000' },
                        axisLabel: { fontSize: 16 },
                        ticks: { stroke: '#000' },
                        grid: { stroke: '#B3E5FC', strokeWidth: 0.25 }
                    }} dependentAxis
                />
                <VictoryAxis
                    style={{
                        axis: { stroke: '#000' },
                        axisLabel: { fontSize: 16 },
                        ticks: { stroke: '#000' },
                        tickLabels: { fontSize: 5, padding: 1, angle: 40, verticalAnchor: 'middle', textAnchor: 'start' }
                    }}
                />
                <VictoryLine
                    style={{ data: { fill: '#3498db' } }}
                    animate
                    alignment="start"
                    data={res}
                />
            </VictoryChart>

        </div>
    );

};

export default Chart;
