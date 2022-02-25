const Grid = require('../lib/model/grid.com.js').default;
const grid = new Grid({
    key: 'grid_sdfsdf',
    type: 'grid3',
    columns: [{
        list: [
            {
                key: 'title_dddd',
                type: 'title',
            }
        ],
    }],
});
console.log(grid);