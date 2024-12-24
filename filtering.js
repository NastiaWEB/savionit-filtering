
        const findDuplicates = (arr) => {
          let sorted_arr = arr.slice().sort();
          let results = [];
          for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
              results.push(sorted_arr[i]);
            }
          }
          return results;
        }

        const removeDuplicates = (arr) => {
          let sorted_arr = arr.slice().sort();
          let results = [];
          if (sorted_arr.length > 1) {
            for (let i = 0; i < sorted_arr.length; i++) {
              if (sorted_arr[i + 1] !== sorted_arr[i]) {
                results.push(sorted_arr[i]);
              }
            }
          }else{
            results = sorted_arr;
          }
          return results;
        }


function filterOptions($this, filter_data){
  console.log("filter_data", filter_data);
  $($this).closest(".vpc-component").find(".vpc-options .vpc-single-option-wrap").addClass("hidden");
  let choosed_products = [];
  let filtered_products = [];
  $.each( filter_data, function( inx, single_item ){
      if (single_item.options.length > 0) {
        $.each( single_item.options, function( i, item ){
          choosed_products.push(item.product_ids);
        });
      }
  });
  if(choosed_products.length > 1){
    let choosed_arr = choosed_products.flat(1);
    filtered_products = findDuplicates(choosed_arr);
  }else if(choosed_products.length !== 0 && choosed_products.length == 1){
    filtered_products = choosed_products.flat(1);
  }
  if(filtered_products.length !== 0){
    $.each( filtered_products, function( inx, single_item ){
      $($this).closest(".vpc-component").find(`#${single_item}`).parent().removeClass("hidden");
    });
  }else if(choosed_products.length == 0) {
    $($this).closest(".vpc-component").find(".vpc-options .vpc-single-option-wrap").removeClass("hidden");
    $($this).closest(".vpc-component").find(".filter_sidebar .option_btn.checked").removeClass("checked");
  }
  var filter_str = encodeURIComponent(JSON.stringify(filter_data));
  $($this).closest(".vpc-component").attr("data-filter", filter_str);
}

function countProducts(filtered_products, counted_arr, component, item){
  const checked = $(item).hasClass("checked");
  const currentCat = $(item).attr("data-cat");
  if (filtered_products.length == 0) {
    $(component).find(".main_filter_btn").removeClass("active").text("סנן");
  }else{  $(component).find(".main_filter_btn").addClass("active").text("סנן פעיל");}
    $(component).find(".filter_options_list .option_btn").each(function(){
      // $(this).removeClass("hidden");
      // $(this).closest("li").removeClass("hidden");
      let product_ids = $(this).attr("data-products");
      let cat = $(this).attr("data-cat");
      const $this = $(this);
      if (product_ids) product_ids = product_ids.split(',');
      if (filtered_products.length == 0) {
        $(this).find(".product_counter").html(`(${product_ids.length})`);
        $(this).removeClass("hidden");
        $(this).closest("li").removeClass("hidden");
      }else{
        let count = product_ids;
        let haveCurrentCat = false;
          $.each( counted_arr, function( index, category ){
            console.log(category.option, cat, currentCat, checked);
            if( category.option !== cat ){
               count = product_ids.filter(element => filtered_products.includes(element));
               // console.log($this, category.option, cat, checked);
               // if (count.length == 0) {
               //   $($this).addClass("hidden");
               //   $($this).closest("li").addClass("hidden");
               // }else{
               //   $($this).removeClass("hidden");
               //   $($this).closest("li").removeClass("hidden");
               // }
             }else if(category.option == currentCat){
               haveCurrentCat = true;
             }
             // else if (!checked ){
             //   count = product_ids.filter(element => filtered_products.includes(element));
             // }
             // else if(counted_arr.length == 1){
             //   $($this).removeClass("hidden");
             //   $($this).closest("li").removeClass("hidden");
             // }
          });
          console.log(haveCurrentCat);
          function hideEmpty(){
            if (count.length == 0) {
              $($this).addClass("hidden");
              $($this).closest("li").addClass("hidden");
            }
            else{
              $($this).removeClass("hidden");
              $($this).closest("li").removeClass("hidden");
            }
          }
          if(!$(this).closest(".filter_sidebar.inner_sidebar.active").length > 0){
            $(this).find(".product_counter").html(`(${count.length})`);
            hideEmpty();
          }else if (!checked && !haveCurrentCat){
            $(this).find(".product_counter").html(`(${count.length})`);
            hideEmpty();
          }
      }
    });
}

function filterAllOptions($this, filter_data){
  $($this).closest(".vpc-component").find(".vpc-options .vpc-single-option-wrap").addClass("hidden");
  $($this).closest(".vpc-component").find(".vpc-group-name").addClass("hidden");
  $($this).closest(".vpc-component").find(".vpc-group").addClass("hidden");
  let choosed_products = [];
  let filtered_products = [];
  let counted_arr = [];
  $.each( filter_data, function( inx, single_item ){
    let choosed_options = [];
      if (single_item.options.length > 0) {
        $.each( single_item.options, function( i, item ){
          $.each( item.product_ids, function( index, id_item ){
            choosed_options.push(id_item);
          });
        });
      }

      if (choosed_options.length > 0) {
        choosed_products.push(removeDuplicates(choosed_options));
        counted_arr.push({ option: `${single_item.name}`, product_ids: choosed_options });
      }
  });
  if(choosed_products.length == 0) {
    $($this).closest(".vpc-component").find(".vpc-options .vpc-single-option-wrap").removeClass("hidden");
    $($this).closest(".vpc-component").find(".vpc-group-name").removeClass("hidden");
    $($this).closest(".vpc-component").find(".vpc-group").removeClass("hidden");
    $($this).closest(".vpc-component").find(".filter_sidebar .option_btn.checked").removeClass("checked");
  }else{
    if (choosed_products.length > 1) {
      $.each( choosed_products, function( inx, choosed_cat ){
        if (inx == 0) {
          $.each( choosed_cat, function( i, product_id ){
            let count = 0;
            $.each( choosed_products, function( inner_inx, inner_choosed_cat ){
              $.each( inner_choosed_cat, function( inner_index, inner_product_id ){
                if (inner_product_id == product_id) count++;
              });
            });
            if (choosed_products.length == count) {
              filtered_products.push(product_id);
            }
          });
        }
      });
    }else{
      let choosed_arr = choosed_products.flat(1);
      filtered_products = removeDuplicates(choosed_arr);
    }
  }
  if(filtered_products.length !== 0){
    $.each( filtered_products, function( inx, single_item ){
      $($this).closest(".vpc-component").find(`#${single_item}`).parent().removeClass("hidden");
      $($($this).closest(".vpc-component").find(`#${single_item}`)).closest(".vpc-group").removeClass("hidden");
      $($($this).closest(".vpc-component").find(`#${single_item}`)).closest(".vpc-group").find(".vpc-group-name").removeClass("hidden");
    });
  }else if(choosed_products.length == 0) {
    $($this).closest(".vpc-component").find(".vpc-options .vpc-single-option-wrap").removeClass("hidden");
    $($this).closest(".vpc-component").find(".vpc-group-name").removeClass("hidden");
    $($this).closest(".vpc-component").find(".vpc-group").removeClass("hidden");
    $($this).closest(".vpc-component").find(".filter_sidebar .option_btn.checked").removeClass("checked");
  }
  var filter_str = encodeURIComponent(JSON.stringify(filter_data));
  $($this).closest(".vpc-component").attr("data-filter", filter_str);
  let component = $($this).closest(".vpc-component");
  countProducts(filtered_products, counted_arr, component, $this);
}
//open filter_sidebar ✓
        $(document).on('click', '.vpc-component .filter_btn', function () {
          $(this).siblings('.filter_sidebar').fadeIn().addClass('active');
          $(this).closest(".vpc-options").css("overflow-y", "hidden");
          if ($(this).hasClass("inner_btn") && $(this).closest(".filter_wrapper").height() <= $(this).closest(".filter_sidebar").height()) {
            $(this).closest(".filter_sidebar").css("overflow-y", "hidden");
          }
        });
// close filter_sidebar ✓
        $(document).on('click', '.vpc-component .filter_sidebar .close_btn', function () {
          $(this).closest(".filter_sidebar").fadeOut().removeClass('active');
          if(!$(this).hasClass("back_btn")){
            $(this).closest(".vpc-options").css("overflow-y", "auto");
            $(this).closest(".filter_sidebar:not(.inner_sidebar)").css("overflow-y", "auto");
          }
        });
// clear all data ✓
        $(document).on('click', '.vpc-component .filter_clear_btn', function () {
          let filter_data = [{name: "suitable", options:[]}, {name: "colors", options:[]}, {name: "texture", options:[]}, {name: "type", options:[]}, {name:"purpose", options:[]}, { name: "supplier", options:[] }, {name:"uv_protection", options:[]}];

          $(`.filter_btn.inner_btn span.choosed_options`).html("");
          filterAllOptions(this, filter_data);
          if($(this).closest(".vpc-component").hasClass(".global-filter")){
            $('.vpc-component:not(.global-filter)').find(".filter_clear_btn").each(function(){
              console.log(this);
              filterAllOptions(this, filter_data);
            });
          }
        });
//choose all
        $(document).on('click', '.vpc-component .filter_sidebar .choose_all', function () {
          $(this).closest(".filter_sidebar").find('.clear_all').removeClass("hidden");
          $(this).addClass("hidden");
          $(this).closest(".filter_sidebar").find("input").prop( "checked", true );
          $(this).closest(".filter_sidebar").find(".option_btn").addClass("checked");
          const $this = $(this);
          let options_arr = [];
          let choosed_str = "";
          let choosed_arr = [];
          $(this).closest(".filter_sidebar").find(".option_btn").each(function (i) {
            let option_name = $(this).attr("data-val");
            let product_ids = $(this).attr("data-products");
            options_arr.push({ option: `${option_name}`, product_ids: product_ids.split(",") });
            choosed_arr.push(option_name);
          });
          let option_cat = $(this).closest(".filter_sidebar").attr("data-cat");
          let filter_data = $(this).closest(".vpc-component").attr("data-filter");
          if (filter_data == undefined || filter_data == "") {
            filter_data = [{name: "suitable", options:[]}, {name: "colors", options:[]}, {name: "texture", options:[]}, {name: "type", options:[]}, {name:"purpose", options:[]}, { name: "supplier", options:[] }, {name:"uv_protection", options:[]}];
          }else{
            filter_data = JSON.parse(decodeURIComponent(filter_data));
          }
          $.each( filter_data, function( inx, single_item ){
            if (single_item.name == option_cat) {
              single_item.options = options_arr;
              if (choosed_arr.length > 0) {
                choosed_str =  choosed_arr.join(', ');
              }
              $($this).closest(".filter_sidebar.active:not(.inner_sidebar)").find(`.filter_btn.inner_btn.${single_item.name} span.choosed_options`).html(choosed_str);
            }
          });
          filterAllOptions(this, filter_data);
        });
//Clear all ✓
        $(document).on('click', '.vpc-component:not(.global-filter) .filter_sidebar .clear_all', function () {
          $(this).closest(".filter_sidebar").find('.choose_all').removeClass("hidden");
          $(this).addClass("hidden");
          $(this).closest(".filter_sidebar").find("input").prop( "checked", false );
          $(this).closest(".filter_sidebar").find(".option_btn").removeClass("checked");
          let option_cat = $(this).closest(".filter_sidebar").attr("data-cat");
          let filter_data = $(this).closest(".vpc-component").attr("data-filter");
          filter_data = JSON.parse(decodeURIComponent(filter_data));
          $.each( filter_data, function( inx, single_item ){
            if (single_item.name == option_cat) {
              single_item.options = [];
              $(`.filter_btn.inner_btn.${single_item.name} span.choosed_options`).html("");
            }
          });
          filterAllOptions(this, filter_data);
        });
        $(document).on('click', '.vpc-component.global-filter .filter_sidebar .clear_all', function () {
          let option_cat = $(this).closest(".filter_sidebar").attr("data-cat");
        $('.vpc-component:not(.global-filter)').find(".clear_all").each(function(){
            if ($(this).closest(".filter_sidebar").attr("data-cat") == option_cat) {
              $(this).click();
            }
          });
        });
//choose option
        $(document).on('click', '.vpc-component:not(.global-filter) .filter_sidebar .option_btn', function () {
          let input = $(this).siblings('.input');
          input.prop("checked", !input.prop("checked"));
          let choosed_str = "";
          let choosed_arr = [];
          let option_cat = $(this).attr("data-cat");
          let option_name = $(this).attr("data-val");
          let product_ids = $(this).attr("data-products");
          let $this = $(this);
          if (product_ids) {
            product_ids = product_ids.split(',');
          }
          let filter_data = $(this).closest(".vpc-component").attr("data-filter");
          if (filter_data == undefined || filter_data == "") {
            filter_data = [{name: "suitable", options:[]}, {name: "colors", options:[]}, {name: "texture", options:[]}, {name: "type", options:[]}, {name:"purpose", options:[]}, { name: "supplier", options:[] }, {name:"uv_protection", options:[]}];
          }else{
            filter_data = JSON.parse(decodeURIComponent(filter_data));
          }

          $(this).toggleClass("checked");
          if($(this).closest(".filter_sidebar").find(".option_btn.checked").length > 0){
            $(this).closest(".filter_sidebar").find(".clear_all").removeClass("hidden");
            $(this).closest(".filter_sidebar").find(".choose_all").addClass("hidden");
          }else{
            $(this).closest(".filter_sidebar").find(".clear_all").addClass("hidden");
            $(this).closest(".filter_sidebar").find(".choose_all").removeClass("hidden");
          }
          let checked = $(this).hasClass("checked");
            $.each( filter_data, function( inx, single_item ){
                  if (single_item.name == option_cat) {
                    if (checked) {
                    single_item.options.push({ option: `${option_name}`, product_ids: product_ids });
                  }else{
                    $.each( single_item.options, function( i, item ){
                      if (item.option == option_name) {
                          if (i==0){
                            single_item.options = single_item.options.slice(1)
                          } else single_item.options = single_item.options.slice(i-1, i);
                      }
                    });
                  }
                  $.each( single_item.options, function( i, item ){
                    choosed_arr.push(item.option);
                  });
                  if (choosed_arr.length > 0) {
                    choosed_str =  choosed_arr.join(', ');
                  }
                  $this.closest(".filter_sidebar.active:not(.inner_sidebar)").find(`.filter_btn.inner_btn.${single_item.name} span.choosed_options`).html(choosed_str);
                  // console.log($this.closest(".filter_sidebar.active"));
              }
            });
          filterAllOptions(this, filter_data);
        });
        $(document).on('click', '.global-filter .option_btn.inner_btn', function (e) {
          let option_cat = $(this).attr("data-cat");
          let option_name = $(this).attr("data-val");
          $('.vpc-component:not(.global-filter) .filter_sidebar .option_btn.inner_btn').each(function(){
            if($(this).attr("data-cat") == option_cat ){
              if ($(this).attr("data-val") == option_name) {
                $(this).click();
              }
            }
          })
        });

// view all items
        $(document).on('click', '.view_all_footer .viewItems', function () {
          $('.filter_sidebar:not(".global_filter_sidebar")').fadeOut().removeClass('active');
          $(this).closest(".vpc-options").css("overflow-y", "auto");
          $(this).closest(".filter_sidebar:not(.inner_sidebar)").css("overflow-y", "auto");
        });
        $(document).on('click', '.global-filter .option_btn.inner_btn', function (e) {});

      $(document).on("click", ".vpc-component-header", function (e) {
        $(".vpc-components-wrapper .vpc-selected.txt").each(function (i) {
            // $(this).on('DOMSubtreeModified', function () {
              let enable_filtering = $("#vpc-components").attr("data-enable_filtering");
              let enable_global_filtering = $("#vpc-components").attr("data-enable_global_filtering");
              console.log(enable_filtering);
              if(enable_filtering == 1) {
                console.log(initFilter);
                initFilter(this);
                // if(i+1 == $(".vpc-components-wrapper .vpc-selected.txt").length && $(".vpc-component.global-filter").attr("data-global_filter").length == 0){
                //   $(".vpc-options >  .filter_sidebar").each(function(){
                //     let filter_options = JSON.parse(decodeURIComponent($(this).attr("data-filter_options")));
                //     let empty = true;
                //     $.each(filter_options, function (index, item) {
                //       if (item.options.length > 0) {
                //         empty = false;
                //         return empty;
                //       }
                //       return empty;
                //     });
                //     if(!empty){}
                //   });
                // }
              }
              //FROM

                if ($(this).text().trim() == "hide123") {
                    $(this).closest('.vpc-component').hide();
                }
                if ($(".new_skin_design").length) {
                    let colorCode = $(this).html();
                    let componentId = $(this).closest('.vpc-component').attr("id");
                    let element = $(this).closest('.vpc-component').find(`.vpc-single-option-wrap.selected label`);
                    if (element.attr("data-oriontip")) {
                        let tooltip_val = element.attr("data-oriontip").split(" ");
                        let matches = tooltip_val.filter(s => s.includes('+₪'));
                        if(matches.length > 0){
                          let tooltip_num = matches.join("").replace('+₪', '');
                          if (Math.floor(tooltip_num) !== 0) {
                              $(this).closest('.vpc-component').find('.vpc-component-header .data-oriontip').html("(" + matches.join("") + ")");
                          } else {
                              $(this).closest('.vpc-component').find('.vpc-component-header .data-oriontip').html("");
                          }
                        }
                    } else {
                        let element = $(this).closest('.vpc-component').find(`select option:selected`);
                        let price_val = element.attr("data-price");
                        if (Math.floor(price_val) !== 0) {
                            $(this).closest('.vpc-component').find('.vpc-component-header .data-oriontip').html("(+₪" + price_val + ")");
                        } else {
                            $(this).closest('.vpc-component').find('.vpc-component-header .data-oriontip').html("");
                        }
                    }
                    //here check if this is option field
                    let closest_select = $(this).closest('.vpc-component').find(`select option`);
                    if (closest_select.length) {
                      addOptions(closest_select);
                      //console.log("New design skin, adding "+closest_select.length+" options");
                    }
                }
                //TO
                $(`.vpc-options select:not(#products-select)`).each(function(){
                  //console.log("next option-selector length: "+$(this).next('.option-selector').length);
                  if ($(this).next('.option-selector').length == 0) {
                    let closest_select = $(this).closest('.vpc-component').find(`select option`);
                    if (closest_select.length) {
                      addOptions(closest_select);
                      //console.log("this.next length = 0, adding"+closest_select.length+" options");
                    }
                  }
                })
            // });
        });
      });
