const moment = require('moment');
module.exports = {
    select : function(selected, options) {
        return options.fn(this).replace(new RegExp('value=\"'+ selected + '\"'), '$&selected="selected"');
    },
    generateDate: function(date, format) {
        return moment(date).format(format);
    },
    paginate: function(options) {

        let output='';
        if (options.hash.current === 1) {
            output += `<li class="page-item disabled"><a class="page-link">1</a></li>`;
        }
        else
        {
            output += `<li class="page-item"><a href="?page=1" class="page-link">1</a></li>`;
        }
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if (i!==1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        for (; i <= (Number(options.hash.current) + 4) && i <=options.hash.pages ; i++) {
            if (i === options.hash.current) {
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            }
        }

        return output;
    }
};