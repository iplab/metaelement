<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
     
	<xsl:template match="/xml">
			<xsl:apply-templates select="row" />
	</xsl:template>

	<xsl:template match="row">
		<xsl:apply-templates select="property" />
	</xsl:template>

	<xsl:template match="property">

		<xsl:if test="@name='category.short_name'">

			<xsl:variable name="id">
				<xsl:for-each select="../property">
					<xsl:if test="@name='category.category_id'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

			<xsl:variable name="is_dpt">
				<xsl:for-each select="../property">
					<xsl:if test="@name='category.is_department'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

			<xsl:variable name="name">
				<xsl:for-each select="../property">
					<xsl:if test="@name='category.display_name'">
						<xsl:value-of select="." />
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>

			<xsl:variable name="menu" select="." />

			<xsl:choose>
				<xsl:when test="$is_dpt='1'">
					<node text="{$name}" id="category_id_{$id}">
						<node text="Administration" on="click: function () {{ deptAdmin.load('{$id}') }}" />
						<node text="Navigation" on="click: function () {{ globalNav.loadCenter('{$id}'); }}" />
						<node text="Pages" on="click : function (){{ pageObj.grid('{$id}'); }}"/> 
						<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}'); }}" />
						<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
					</node>
				</xsl:when>

				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="$menu='products'">
							<node text="Products" id="category_id_{$id}">
								<node text="Product Inventory" on="click : function (){{ products.load(); }}"/>
								<node text="Administration" on="click: function () {{ productsAdmin.load(); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
							</node>
						</xsl:when>
			
						<xsl:when test="$menu='global'">
							<node text="Global" id="category_id_{$id}">
								<node text="Administration" on="click: function () {{  }}" />
								<node text="Navigation" on="click: function () {{ globalNav.loadCenter('{$id}'); }}" />
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}','Global'); }}"/> 
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}','Global'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}','Global'); }}"/>
							</node>
						</xsl:when>
			
						<xsl:when test="$menu='home'">
							<node text="Home" id="category_id_{$id}">
								<node text="Administration" on="click: function () {{  }}" />
								<node text="Navigation" on="click: function () {{ globalNav.loadCenter('{$id}'); }}" />
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}','Home'); }}" />
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}','Home'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}','Home'); }}"/>
							</node>
						</xsl:when>
	
						<xsl:when test="$menu='close-up'">
							<node text="Close-Ups" id="category_id_{$id}">
								<node text="Administration" on="click: function () {{ deptAdmin.load('{$id}') }}" />
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}'); }}"/> 
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
								<node text="Inventory" on="click : function (){{ closeups.load('{$id}'); }}"/>
								<node text="Navigation" on="click: function () {{ globalNav.loadCenter('{$id}'); }}" />
							</node>
						</xsl:when>
		
						<xsl:when test="$menu='checkout'">
							<node text="Shopping Cart" id="category_id_{$id}">
								<node text="Administration" on="click: function () {{  }}" />
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}'); }}"/> 
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
							</node>
						</xsl:when>
			
						<xsl:when test="$menu='my-account'">
							<node text="My Account" id="category_id_{$id}">
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}'); }}"/> 
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
							</node>
						</xsl:when>
	
						<xsl:when test="$menu='help'">
							<node text="Help" id="category_id_{$id}">
								<node text="Pages" on="click : function (){{ pageObj.grid('{$id}'); }}"/> 
								<node text="Modules" on="click : function (){{ moduleObj.grid('{$id}'); }}" />
								<node text="Assets" on="click : function (){{ assetObj.grid('{$id}'); }}"/>
							</node>
						</xsl:when>
	
						<xsl:when test="$menu='site-admin'">
							<node text="Site Administration" id="category_id_{$id}">
								<node text="CMA Administrators" on="click : function (){{ manageAdmins.loadCenter(); }}" />
								<node text="User Accounts" on="click: function () {{ manageCDAUsers.loadCenter(); }}" />
								<node text="User Opt-ins" on="click : function (){{ manageOptins.loadCenter(); }}" />
								<node text="Suggest a Title" on="click : function (){{  }}"/> 
							</node>
						</xsl:when>
			
						<xsl:when test="$menu='content'">
							<ajaxNode text="Content" id="category_id_{$id}" iconCls="folder" leaf="false" />
						</xsl:when>
		
						<xsl:otherwise>
							<ajaxNode text="{$name}" id="category_id_{$id}" iconCls="folder" leaf="false" extendedChildren="true" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
