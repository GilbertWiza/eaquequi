const CommentParser = require('./comment-parser.js');

class LineParser {
    constructor(content = '') {
        let pos = 0;

        // force to string
        if (typeof content !== 'string') {
            content = `${content}`;
        }

        const commentParser = new CommentParser(content);
        this.comments = commentParser.comments;

        // only \n, common on Linux and macOS
        // \r\n, common on Windows
        this.lines = content.split(/\n/).map((text, line) => {

            let n = 1;
            // may ends with \r
            const reg = /\r$/;
            if (reg.test(text)) {
                text = text.slice(0, -1);
                n += 1;
            }

            const length = text.length;
            const start = pos;
            const end = start + length;

            pos += length + n;

            // =============================
            const blankBlock = /\S/;

            let blank = false;
            if (!blankBlock.test(text)) {
                blank = true;
            }

            // =============================
            let comment = false;
            let indent = length;
            if (!blank) {
                indent = text.search(blankBlock);

                if (commentParser.isComment(start + indent, end)) {
                    comment = true;
                }

            }

            // =============================

            return {
                line,

                length,
                indent,

                start,
                end,

                blank,
                comment,

                text
            };
        });
    }

    findLine(position) {
        const list = this.lines;
        let start = 0;
        let end = list.length - 1;
        while (end - start > 1) {
            const i = Math.floor((start + end) * 0.5);
            const item = list[i];
            if (position < item.start) {
                end = i;
                continue;
            }
            if (position > item.end) {
                start = i;
                continue;
            }
            return list[i];
        }
        // last two items, less is start
        const endItem = list[end];
        if (position < endItem.start) {
            return list[start];
        }
        return list[end];
    }

}

module.exports = LineParser;
