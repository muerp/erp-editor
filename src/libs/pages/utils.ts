export const clearFormat = (fragment: any[]) => {
    for (let i=0; i<fragment.length; ++i) {
        const item = fragment[i];
        if (item.text) {
            delete item.backgroundColor
            delete item.fontColor
            delete item.fontSize
            delete item.fontWeight
            delete item.bold
            delete item.strikethrough
            delete item.underline
            delete item.code
            delete item.italic
            delete item.sub
            delete item.sup
        } else if (item.type?.startsWith('heading-')) {
            item.type = 'paragraph';
            clearFormat(item.children)
        } else if (item.type === 'link') {
            delete item.type
            delete item.href
            item.text = item.children[0].text;
            delete item.children
        } else if (item.type === 'blockquote') {
            item.type = 'paragraph';
            clearFormat(item.children)
        }  else if (item.type === 'unordered-list' || item.type === 'ordered-list' || item.type === 'task-list') {
            item.type = 'paragraph';
            clearFormat(item.children)
        } else if (item.children) {
            clearFormat(item.children)
        }
    }

    console.log(fragment)
}

export const cssPx = (px?: number | string, defaultValue: string = '') => {
    if (!px) return defaultValue;
    if (typeof px === 'number') return px+'px';
    return px;
}

export const moment = (format: string, time?: number | string | Date | undefined) => {
    if (!time) return '';
    if (typeof time === 'number') {
      if ((time + '').length === 10) {
        time *= 1000;
      }
    }
    const date = new Date(time);
    function pad(n: number): string {
      return n < 10 ? '0' + n : n + '';
    }
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // const txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const txt_months = ["", "Jan", "Feby", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const f: any = {
      s: function () {
        return pad(date.getSeconds());
      },
      // Month
      F: function () {
        return txt_months[f.n()]
      },
      m: function () {
        return pad(date.getMinutes());
      },
      n: function () {
        return date.getMonth() + 1
      },
      h: function () {
        return pad(date.getHours());
      },
      H: function () {
        return pad(date.getHours());
      },
      y: function () {
        return pad(date.getFullYear());
      },
      M: function () {
        return pad(date.getMonth() + 1);
      },
      d: function () {
        return pad(date.getDate());
      },
      w: function () {
        return date.getDay();
      },
      l: function () {
        return weekdays[f.w()];
      },
      a: function () {
        return date.getHours() > 11 ? 'PM' : 'AM';
      }
    };
    return format.replace(/[a-zA-Z]/g, function (t: string) {
      let ret = '';
      if (f[t]) {
        ret = f[t]();
      } else {
        ret = t;
      }
      return ret;
    });
  };