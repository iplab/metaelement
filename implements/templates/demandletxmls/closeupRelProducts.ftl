<xml>
	<#list closeup.product as types>	
		<object <#if types.count?exists>count="${types.count}"</#if>>
			<#list types.products as prod>
				<row>
					<#if (prod.product_id?exists)>
						<product_id>${prod.product_id}</product_id>
					</#if>
					<#if (prod.gift_wrap?exists)>
						<gift_wrap>${prod.gift_wrap}</gift_wrap>
					</#if>
					<#if (prod.personalized?exists)>
						<personalized>${prod.personalized}</personalized>
					</#if>
					<#if (prod.product_canada?exists)>
						<product_canada>${prod.product_canada}</product_canada>
					</#if>
					<#if (prod.title?exists)>
						<name>${prod.title}</name>
					</#if>
					<#if (prod.item_number?exists)>
						<item_number>${prod.item_number}</item_number>
					</#if>
					<#if (prod.page_name?exists)>
						<page_name>${prod.page_name}</page_name>
					</#if>
					<#if (prod.src_image?exists)>
						<image>${prod.src_image}</image>
					</#if>
					<#if (prod.feature_image?exists)>
						<feature_image>${prod.feature_image}</feature_image>
					</#if>
					<#if (prod.type_id?exists)>
						<type_id>${prod.type_id}</type_id>
					</#if>
					<#if (prod.type?exists)>
						<type>${prod.type}</type>
					</#if>
					<#if (prod.drop_ship_us?exists)>
						<drop_ship_us>${prod.drop_ship_us}</drop_ship_us>
					</#if>
					<#if (prod.drop_ship_canada?exists)>
						<drop_ship_canada>${prod.drop_ship_canada}</drop_ship_canada>
					</#if>
					<#if (prod.msrp_us?exists)>
						<msrp_us>${prod.msrp_us}</msrp_us>
					</#if>
					<#if (prod.msrp_canada?exists)>
						<msrp_canada>${prod.msrp_canada}</msrp_canada>
					</#if>
					<#if (prod.our_price_us?exists)>
						<our_price_us>${prod.our_price_us}</our_price_us>
					</#if>
					<#if (prod.our_price_canada?exists)>
						<our_price_canada>${prod.our_price_canada}</our_price_canada>
					</#if>
					<#if (prod.sale_price_us?exists)>
						<sale_price_us>${prod.sale_price_us}</sale_price_us>
					</#if>
					<#if (prod.sale_price_canada?exists)>
						<sale_price_canada>${prod.sale_price_canada}</sale_price_canada>
					</#if>
					<#if (prod.format_id?exists)>
						<format_id>${prod.format_id}</format_id>
					</#if>
					<#if (prod.format?exists)>
						<format>${prod.format}</format>
					</#if>
					<#if (prod.short_description?exists)>
						<short_description>${prod.short_description}</short_description>
					</#if>
					<#if (prod.availability_us?exists)>
						<availability_us>${prod.availability_us}</availability_us>
					</#if>
					<#if (prod.availability_date_us?exists)>
						<availability_date_us>${prod.availability_date_us}</availability_date_us>
					</#if>
					<#if (prod.availability_canada?exists)>
						<availability_canada>${prod.availability_canada}</availability_canada>
					</#if>
					<#if (prod.availability_date_canada?exists)>
						<availability_date_canada>${prod.availability_date_canada}</availability_date_canada>
					</#if>
					<#if (prod.back_order_date_us?exists)>
						<back_order_date_us>${prod.back_order_date_us}</back_order_date_us>
					</#if>
					<#if (prod.back_order_date_canada?exists)>
						<back_order_date_canada>${prod.back_order_date_canada}</back_order_date_canada>
					</#if>
					<#if (prod.product_inventory?exists)>
						<product_inventory>${prod.product_inventory}</product_inventory>
					</#if>
				</row>
			</#list>
		</object>
	</#list>
</xml>
