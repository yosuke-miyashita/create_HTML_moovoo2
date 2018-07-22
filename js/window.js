// 現在時刻を取得
function createDate () {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}/${month}/${day}`;
}

// 画像をいれる
function insertImg (element) {
    const extension_id = chrome.i18n.getMessage('@@extension_id');
    var image_div = document.createElement("div");
    image_div.classList.add("insert_image");
    const image = document.createElement('img');
    image.id = 'akasananosa_chrome_extension';
    image.src = `chrome-extension://${extension_id}/img/moovoo_emblem.png`;
    image.style = 'width:70px;height:70px;border-radius:10%;';
    image_div.appendChild(image);
    element.appendChild(image_div);
    return image;
}

function insertForm(){
    var input_area = document.createElement("div");
    input_area.id = "input_area";
    input_area.style.display = "none";
    input_area.innerHTML = `
    <form id="itemData_form">
        <a id="close_input_area">
            <span style='color: blue;font-weight: bolder; '>閉</span><span style='color: red;font-weight: bolder; '>じ</span><span style='color: yellow;font-weight: bolder; '>る</span>
        </a>
        <ul>
            <li class="input_item_name">
                <label for="email">製品名：</label>
                <input type="text" id="item_name" placeholder="moovooメモ張" >  
            </li>
            <li class="input_price">
                <label for="email">価格：</label>
                <input type="text" id="price" placeholder="500" >
            </li>
            <li class="input_item_img">
                <label for="email">画像URL：</label>
                <input type="text" id="item_img" placeholder="https://giga-images-makeshop-jp.akamaized.net/moovoo/shopimages/02/00/1_000000000002.jpg?1512801916" >
            </li>
            <li class="input_item_url">
                <label for="email">ページURL：</label>
                <input type="text" id="item_url" placeholder="https://moovoo.shop/shopdetail/000000000002/" >
            </li>
        </ul>
        <a id="create_html">HTML生成</a>
    </form>`;
    var footer = document.getElementById("mvfrm-footer");
    footer.appendChild(input_area);
}

// コピー( 参考: https://qiita.com/simiraaaa/items/2e7478d72f365aa48356 )
function execCopy (string) {
    const temp = document.createElement('div');
    const html_textarea = document.createElement('textarea');
    html_textarea.id = "copy_textarea";
    temp.appendChild(html_textarea).textContent = string;
    document.body.appendChild(temp);
    html_textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(temp);
    return result;
}

function create_html(){
    const date = createDate();
    const item_name = document.forms.itemData_form.item_name.value;
    const price = document.forms.itemData_form.price.value;
    if(isNaN(price)){
        alert("値段が数値で入力されていないようです。金額を半角数字で入力してください。");
        return;
    }
    const item_img = document.forms.itemData_form.item_img.value;
    if (item_img.match(/jpg/)){

    }else if(item_img.match(/jpeg/)){

    }else if(item_img.match(/png/)){

    }else{
        alert("画像URL先が画像ではないようです。画像のアドレスを貼り付けてください。");
        return;        
    }
    const item_url = document.forms.itemData_form.item_url.value;
    if (!item_url.match(/http/)) {
        alert("ページURLがURLではないようです。URLを入力してください。");
        return;
    }

    const html = `
    <style type="text/css">
        .amazon_stage ul {
          list-style: none !important;
          padding-left: 5px !important;
        }
        .amazon_stage{
            max-width: 600px !important;
            padding: 0.5em 1em !important;
            margin: 2em auto !important;
            border: double 5px #4ec4d3 !important;  

            text-align:left !important;
            font-size:small !important;
            zoom: 1 !important;
            overflow: hidden !important;
        }
        .amazon_image a img{
            float:left !important;
            margin:0px 10px 0px -5px !important;
            width: 120px !important;
            height: 120px !important;
            object-fit: contain !important;
        }
        .amazon_info{
            line-height:100% !important;
            zoom: 1 !important;
            overflow: hidden !important;    

            margin-top: auto !important;
            margin-bottom: auto !important;
        }
        .amazon_item_name{
            margin:10px 0 !important;
            line-height:120% !important;
            color: #000000  !important;
        }
        .amazon_btn {
            display: block !important;
            max-width: 120px !important;
            padding: 0.8em !important;
            text-align: center !important;
            text-decoration: none !important;
            color: #ffa500 !important;
            border: 2px solid #ffa500 !important;
            border-radius: 3px !important;
            transition: .4s !important;
            margin-top: 15px !important;
            font-size: 12px !important;
            font-weight: bold !important;
        }
        .amazon_btn:hover {
            background: #ffa500 !important;
            color: #fff !important;
        }   

        </style>
        <div class="amazon_stage">
            <div class="amazon_image">
                <a href="${item_url}" target="blank">
                    <img src="${item_img}">
                </a>
            </div>
            <div class="amazon_info">
                <ul>
                    <li>
                        <div class="amazon_item_name"><a href="${item_url}" target="blank">${item_name}</a></div>
                    </li>
                    <li>
                        <div class="amazon_price">￥${price}(※${date}時点)</div>
                    </li>
                    <li>
                        <a href="${item_url}" target="blank" class="amazon_btn">購入</a>
                    </li>
                </ul> 
            </div>
        </div>
        `;
    const result = execCopy(html); // 成功(true) or 失敗(false)
    console.log(html);
    result? alert("コピーされました。任意の箇所でペーストしてください。") : alert("失敗しました。@akasananosaまで連絡を…。");
}

// ここから実行
function main() {
    const body_element = document.getElementById("mvfrm-footer");
    if (body_element === null) return;
    const image = insertImg(body_element);
    const form = insertForm();
    $("#akasananosa_chrome_extension").click(
        function(){
            if ($('#input_area').css('display') == 'block') {
                // 表示されている場合の処理
                $("#input_area").css("display","none");
            } else {
                // 非表示の場合の処理
                $("#input_area").css("display","block");
            }
        }
    );
    $('#create_html').click(function(){
        create_html();
    });
    $("#close_input_area").click(
        function(){
            $("#input_area").css("display","none");
        }
    );
}
main();