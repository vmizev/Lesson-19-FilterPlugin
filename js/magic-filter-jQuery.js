;(function($){
	
	var defaults = {
		
	}

	function MagicFilter (options, elements){
		this.config = $.extend({}, defaults, options);
		this.element = elements;
		this.init();		
	}

	MagicFilter.prototype.init = function() {
		var self = this;

		this._categoryArray = [];
		for (var i = 0; i < this.element.length; i++){
			this._categoryArray.push($(this.element[i]).attr('data-target'));			
		}	
		this._categoryArray = this._categoryArray.filter(this.unicArrayFilter);
		
		this.createObjCategory();
		this.action(self);
	};

	MagicFilter.prototype.getCategoryArray = function(){
		return this._categoryArray;
	}



	MagicFilter.prototype.unicArrayFilter = function(value, index, arr){
		return arr.indexOf(value) === index;
	}

	MagicFilter.prototype.createObjCategory = function(){
		this._objCategory = {};

		for (var i = 0; i < this._categoryArray.length; i++) {
			this._objCategory[this._categoryArray[i]] = [];
		}
		return this._objCategory;		
	}

	MagicFilter.prototype.getCategoryObject = function(){
		return this._objCategory;
	}

	MagicFilter.prototype.updateCategoryAll = function(){
		var categoryObj = this.getCategoryObject();
		var category = this.getCategoryArray();
		var allCategoryStr = '';
		for (var i = 0; i < category.length; i++){	
			allCategoryStr += categoryObj[category[i]].join() + ' ';		
			$('#all').text(allCategoryStr);			
		}	
	}

	MagicFilter.prototype.action = function(self){	
				
		$(this.element).on('click', function () {
			var categoryObj = self.getCategoryObject();
			var target = $(this).attr('data-target');
			var checkbox = '[data-target='+target+']'+':checked';
			categoryObj[target] = [];
			$(checkbox).each(function(){
				categoryObj[target].push(this.value);
			});
			$(target).text(categoryObj[target].join()); // Запись строки с value в правый блок	
			self.updateCategoryAll();
			//console.log(categoryObj[category[i]]);
			self.sendAjax(categoryObj);	
		})

		$('.reset-category').on('click', function(){
			var categoryObj = self.getCategoryObject();
			var target = $(this).attr('data-target');
			categoryObj[target] = [];
			$(target).text(categoryObj[target].join());
			$('[data-target='+target+']'+':checked').prop('checked', false);
			self.updateCategoryAll();

		})

		$('.reset-all').on('click', function(){
			var categoryObj = self.createObjCategory();
			var category = self.getCategoryArray();

			for (var i = 0; i < category.length; i++){
				var target = category[i];
				$(target).text(categoryObj[target].join());
				$('[data-target='+target+']'+':checked').prop('checked', false);
			}
			self.updateCategoryAll();

			$('.content-load').empty();				
		})
	}



	MagicFilter.prototype.sendAjax = function(obj) {
		$('.loader').fadeIn('slow');
		setTimeout(function(){
			//$('.content-load').load('item.html');
			 $.ajax({
			 	type: 'get',
			 	url: 'item.html',
			 	data: JSON.stringify(obj),
			 	success: function(response){
			 		$('.loader').fadeOut('slow');
			 		$('.content-load').append(response);
			 	},
			 })
		}, 1000);
	}




	$.fn.magicFilter = function(options){
		new MagicFilter(options, this);
	}
})(jQuery);