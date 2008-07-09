<xml>
	<#list page.items as item>
		<#--<item <#if (item.type?exists)>type="${item.type}"</#if>>-->
		<item type="PRODUCT">
			<#if (item.header_text?exists)>
				<header_text><![CDATA[${item.header_text}]]></header_text>
			<#else>
				<#if (item.title?exists)><header_text><![CDATA[${item.title}]]></header_text></#if>
			</#if>
			<#if (item.image?exists)>
				<image><![CDATA[${item.image}]]></image>
			<#else>
				<image><![CDATA[]]></image>
			</#if>
			<#if (item.video?exists)>
				<video <#if (item.location?exists)>location="${item.location}"</#if>><![CDATA[${item.video}]]></video>
			<#else>
				<video location=""><![CDATA[]]></video>
			</#if>
			<#if (item.call_to_action?exists)>
				<call_to_action <#if (item.call_to_action?exists)>url="${item.call_to_action}"</#if> color="#28527C"><![CDATA[${item.call_to_action}]]></call_to_action>
			<#else>
				<call_to_action <#if (item.page_name?exists)>url="${item.page_name}"</#if> color="#28527C"><![CDATA[Learn More]]></call_to_action>
			</#if>
			<#if (item.customer_rating?exists)>
				<customer_rating>${item.customer_rating}</customer_rating>
			<#else>
				<customer_rating>4</customer_rating>
			</#if>
			<#if (item.product_id?exists)>
				<product_id>${item.product_id}</product_id>
			</#if>
			<#if (item.item_number?exists)>
				<product_number>${item.item_number}</product_number>
			</#if>
			<#if (item.title?exists)>
				<product_name color="#28527C"><![CDATA[${item.title}]]></product_name>
			</#if>
			<#if (item.short_description?exists)>
				<product_description color="#505457"><![CDATA[${item.short_description}]]></product_description>
			</#if>
			<#if (item.product_price_us_new?exists)>
				<product_price_us color="#E7640A" <#if (item.msrp_us?exists)>old="${item.msrp_us}"</#if>>${item.product_price_us_new}</product_price_us>
			</#if>
			<#if (item.product_price_canada_new?exists)>
				<product_price_canada color="#E7640A" <#if (item.msrp_canada?exists)>old="${item.msrp_canada}"</#if>>${item.product_price_canada_new}</product_price_canada>
			</#if>
			<#if (item.format?exists)>
				<product_format>${item.format}</product_format>
			</#if>
			<#if (item.src_image?exists)>
				<product_image><![CDATA[${item.src_image}]]></product_image>
			</#if>
			<#if (item.gift_wrap?exists)>
				<gift_wrap>${item.gift_wrap}</gift_wrap>
			</#if>
			<#if (item.drop_ship_us?exists)>
				<drop_ship_us>${item.drop_ship_us}</drop_ship_us>
			</#if>
			<#if (item.drop_ship_canada?exists)>
				<drop_ship_canada>${item.drop_ship_canada}</drop_ship_canada>
			</#if>		
			<#if (item.availability_date_us?exists)>
				<#--<product_availability_us  <#if (item.display?exists)>display="${item.display}"</#if>  stock="In-Stock">${item.availability_date_us}</product_availability_us>-->
				<product_availability_us  display="true"  stock="In-Stock">${item.availability_date_us}</product_availability_us>
			</#if>
			<#if (item.availability_date_canada?exists)>
				<#--<product_availability_canada <#if (item.display?exists)>display="${item.display}"</#if>  stock="In-Stock">${item.availability_date_canada}</product_availability_canada>-->
			    <product_availability_canada  display="true"  stock="In-Stock">${item.availability_date_canada}</product_availability_canada>
			</#if>
			<product_buy><![CDATA[javascript:cart.add('$pid',{product_number:'$pnumber',product_name:'$pname',product_price:'$pprice',product_format:'$pformat',product_image:'$pimage',product_availablility:'$pavail',product_availability_date:'$pavaildate',product_giftwrap:'$pgiftwrap',product_ship_cost:'$pdropship',product_shipping:'$pshipping'});]]></product_buy>
        </item>
	</#list>
</xml>
