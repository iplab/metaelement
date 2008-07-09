<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
     
	<xsl:template match="/xml">
			<xsl:apply-templates select="object" />
	</xsl:template>

	<xsl:template match="object">
		<xsl:apply-templates select="property" />
	</xsl:template>		

	<xsl:template match="property">

		<xsl:if test="@name='display_name'">

			<xsl:variable name="id">
			<xsl:for-each select="../property">
				<xsl:if test="@name='category_id'">
					<xsl:value-of select="." />
				</xsl:if>
			</xsl:for-each>
			</xsl:variable>

			<xsl:variable name="menu" select="." />

			<ajaxNode text="{$menu}" id="asset_category_id_{$id}" iconCls="folder" leaf="false" extendedChildren="false" assetsAjax="true" on="click: function () {{ assetSelector.displayAssets('{$id}'); }}" />
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>