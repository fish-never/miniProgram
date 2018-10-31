//通过ID，获取试题
function getQuestionById(list, id) {
  let data = {};
  for(let n = 0 ;n<list.length;n++){
    if (list[n].number == parseInt(id)) {
        data = list[n];
        break;
    }
  }
  return data;
}
//分析文章试题
function parseParagraphs(content, paragraphQuestionList) {
  var paragraphs = {
    fragments: []
  };
  //标题
  var html = content.replace(/<b>(.*?)<\/b>/, "");
  if (RegExp.$1) {
    paragraphs.fragments.push({
      type: 'title',
      content: RegExp.$1
    });
  }
  var sections = html.replace(/\n/g, '').split(/<br\/>/);
  for (var i = 0; i < sections.length; i++) {
    var ms = sections[i].match(/##\d+##/g);
    var qs = sections[i].split(/##\d+##/);
    for (var n = 0; n < qs.length; n++) {
      //段落片段
      if (qs[n] != '') {
        paragraphs.fragments.push({
          type: 'paragraph',
          content: qs[n]
        });
      }
      if (n < qs.length - 1) {
        ms[n].match(/##(\d+)##/)
        paragraphs.fragments.push({
          type: 'question',
          id: RegExp.$1,
          content: getQuestionById(paragraphQuestionList, RegExp.$1)
        });
      }
    }
    //段落片段
    paragraphs.fragments.push({
      type: 'br'
    });
  }
  // let num = paragraphs.fragments.length -1;
  // paragraphs.fragments.forEach((item,index) => {

  //   if (item.type == 'br' && index < num){
  //     let key = paragraphs.fragments[index + 1].type;
  //     if (key =='paragraph'){
  //       paragraphs.fragments[index + 1].type ='paragraphIndent'
  //     }
  //   }
  // })
  return paragraphs;
}

export default parseParagraphs
