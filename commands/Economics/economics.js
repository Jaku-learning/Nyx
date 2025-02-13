const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, ActionRowBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode.js');
const { ComponentType } = require('../../node_modules/discord-api-types/v10');

function roundDownNumber(value) {
	if ((value >= 1000000)) {
		return Math.abs(value) > 999999 ? Math.sign(value) * ((Math.abs(value) / 1000000).toFixed(1)) + 'M' : Math.sign(value) * Math.abs(value)
	} else if ((value >= 1000)) {
		return Math.abs(value) > 999 ? Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + 'k' : Math.sign(value) * Math.abs(value)
	} else {
		return value;
	}
}

module.exports = {
	name: 'economics',
	description: 'Manage the economics of your nation in one place!',
	server: true,
	devOnly: true,
	callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
		const country = await getColorCode(member);

		await interaction.deferReply({ ephemeral: false });

		// Economic Factors
		const taxRate = await getData(country.id, 'tax_rate', 5);
		const housing = await getData(country.id, 'housing', 10);
		const buildingSlots = await getData(country.id, 'tax_rate', 10);
		const productionCapacity = await getData(country.id, 'production_capacity', 25);
		const researchCapacity = await getData(country.id, 'research_capacity', 100);
		const administrativeCapacity = await getData(country.id, 'administrative_capacity', 100);
		const pops = await getData(country.id, 'pops', 5);
		const popsGrowth = await getData(country.id, 'pops_growth', 1);
		const energy = await getData(country.id, 'energy', 10);
		const tradeValue = await getData(country.id, 'trade_value', 1);
		const instability = await getData(country.id, 'instability', "No Data");
		const attrition = await getData(country.id, 'attrition', "No Data");
		const economicLevel = await getData(country.id, 'economic_level', "No Data");
		var totalBuildings = 1;

		// Needs
		var modifierStab;
		var modifierAttrition;

		switch (instability) {
			case "Low":
				break;
			case "Medium":
				modifierStab = 0.2;
				break;
			case "High":
				modifierStab = 0.5;
				break;
			case "Extreme":
				modifierStab = 0.8;
				break;
		}

		switch (attrition) {
			case "Low":
				break;
			case "Medium":
				modifierAttrition = 0.2;
				break;
			case "High":
				modifierAttrition = 0.5;
				break;
			case "Extreme":
				modifierAttrition = 0.8;
				break;
		}
		
		// Needs Calculations and Maintenance Costs
		var foodNeed = await pops * (40 + modifierAttrition);
		var amenitiesNeed = await pops * (2 + modifierAttrition);
		var energyNeed = await (pops + totalBuildings) * (1.5 + modifierAttrition + modifierStab / (tradeValue / 3));
		var adminNeed = await pops * (5 + modifierStab);

		
		//Special Structures
		var resourceSilos = await getData(country.id, 'resource_silos', 10000);

		//Special Resources
		var funds = await getData(country.id, 'funds', 10000);

		// Get All Normal Resources
		const coal = await getData(country.id, 'coal', 0);
		const iron = await getData(country.id, 'iron', 0);
		const gold = await getData(country.id, 'gold', 0);
		const zinc = await getData(country.id, 'zinc', 0);
		const uranium = await getData(country.id, 'uranium', 0);
		const oil = await getData(country.id, 'oil', 0);
		const bauxite = await getData(country.id, 'bauxite', 0);
		const chromium = await getData(country.id, 'chromium', 0);
		const copper = await getData(country.id, 'copper', 0);
		const diamond = await getData(country.id, 'diamond', 0);
		const manganese = await getData(country.id, 'manganese', 0);
		const pgem = await getData(country.id, 'pgem', 0);
		const peat = await getData(country.id, 'peat', 0);
		const rareearthmetals = await getData(country.id, 'rareearthmetals', 0);
		const rubber = await getData(country.id, 'rubber', 0);
		const silver = await getData(country.id, 'silver', 0);
		const thorium = await getData(country.id, 'thorium', 0);
		const tin = await getData(country.id, 'tin', 0);
		const titanium = await getData(country.id, 'titanium', 0);
		const tungsten = await getData(country.id, 'tungsten', 0);
		const nickel = await getData(country.id, 'nickel', 0);
		const food = await getData(country.id, 'food', 0);

		// --- Get All Buildings ---

		// City Districts
		const commonCity = await getData(country.id, 'common_city', 4);
		const metropolis = await getData(country.id, 'metropolis', 2);
		const megalopolis = await getData(country.id, 'megalopolis', 0);
		const floatingCity = await getData(country.id, 'floating_city', 0);
		const refugeeCamp = await getData(country.id, 'refugee_camp', 0);
		const touristicDistrict = await getData(country.id, 'touristic_district', 0);
		const redLightDistrict = await getData(country.id, 'red_light_district', 0);

		// Research
		const researchCenter = await getData(country.id, 'research_center', 0);
		const researchComplex = await getData(country.id, 'research_complex', 0);
		const advancedResearchInstitute = await getData(country.id, 'advanced_research_institute', 0);
		var researchPointProduction = (researchCenter*200) + (researchComplex*500) + (advancedResearchInstitute*1500);

		// Civilian Industry
		const industrialHub = await getData(country.id, 'industrial_hub', 0);
		const largeIndustrialHub = await getData(country.id, 'large_industrial_hub', 0);
		const civilianIndustrialComplex = await getData(country.id, 'civilian_industrial_complex', 0);
		var industrialCapacityProduction = (industrialHub*25) + (largeIndustrialHub*60) + (civilianIndustrialComplex*100);

		// Civilian Infrastructure
		const highway = await getData(country.id, 'highway', 0);
		const airport = await getData(country.id, 'airport', 0);
		const ralway = await getData(country.id, 'ralway', 0);
		const port = await getData(country.id, 'port', 0);

		// Military Infrastructure
		const smallMilitaryBase = await getData(country.id, 'small_military_base', 0);
		const mediumMilitaryBase = await getData(country.id, 'medium_military_base', 0);
		const largeMilitaryBase = await getData(country.id, 'large_military_base', 0);
		const militaryIndustrialHub = await getData(country.id, 'military_industrial_hub', 0);
		const largeMilitaryIndustrialHub = await getData(country.id, 'large_military_industrial_hub', 0);
		const militaryIndustrialComplex = await getData(country.id, 'military_industrial_complex', 0);
		const shipyard = await getData(country.id, 'shipyard', 0);
		const largeShipyard = await getData(country.id, 'large_shipyard', 0);
		const superMassiveShipyard = await getData(country.id, 'super_massive_shipyard', 0);

		// Energy Infrastructure
		const oilPowerPlant = await getData(country.id, 'oil_power_plant', 0);
		const coalPowerPlant = await getData(country.id, 'coal_power_plant', 0);
		const hydroelectricPowerPlant = await getData(country.id, 'hydroelectric_power_plant', 0);
		const windFarm = await getData(country.id, 'wind_farm', 0);
		const solarFarm = await getData(country.id, 'solar_farm', 0);
		const geothermalPowerPlant = await getData(country.id, 'geothermal_power_plant', 0);
		const nuclearFissionPowerPlant = await getData(country.id, 'nuclear_fission_power_plant', 0);
		const nuclearFusionPowerPlant = await getData(country.id, 'nuclear_fusion_power_plant', 0);


		// Miscellaneous
		const clinic = await getData(country.id, 'clinic', 0);
		const hospital = await getData(country.id, 'hospital', 0);
		const school = await getData(country.id, 'school', 0);
		const university = await getData(country.id, 'university', 0);
		const administrativeCenter = await getData(country.id, 'uranium', 0);
		const smallCommercialHub = await getData(country.id, 'small_commercial_hub', 0);
		const largeCommercialHub = await getData(country.id, 'large_commercial_hub', 0);

		//Mines Note: Need to be looped with all the resource values separately
		var smallMine; //small_${resource}_mine
		var largeMine; //large_${resource}_mine

		// -- PRODUCTS / PROCESSED GOODS --
		
		const amenities = await getData(country.id, 'amenities', 0);
		const consumerGoods = await getData(country.id, 'coal', 0);
		const militaryGoods = await getData(country.id, 'iron', 0);
		const advancedChemicals = await getData(country.id, 'gold', 0);
		const specializedIndustrialMachinery = await getData(country.id, 'zinc', 0);
		const plastics = await getData(country.id, 'plastics', 0);
		const volatileMaterials = await getData(country.id, 'bauxite', 0);
		const advancedElectronics = await getData(country.id, 'chromium', 0);
		const bureaucraticServices = await getData(country.id, 'copper', 0);
		const luxuryGoods = await getData(country.id, 'diamond', 0);
		const medicines = await getData(country.id, 'manganese', 0);
		const miningEquipment = await getData(country.id, 'pgem', 0);
		const civilianAutomobiles = await getData(country.id, 'peat', 0);
		const civilianAircraft = await getData(country.id, 'rareearthmetals', 0);
		const civilianTrains = await getData(country.id, 'rubber', 0);
		
		// Buttons and Menu Handling
		const baseStats = new ButtonBuilder()
            .setCustomId('stats_button')
            .setLabel('National Stats')
            .setStyle(ButtonStyle.Success)
            .setEmoji('<:paraarriba:1283459290211946596>');
        const resources = new ButtonBuilder()
            .setCustomId('resources_button')
            .setLabel('Resources')
            .setStyle(ButtonStyle.Success)
			.setEmoji('<:paraarriba:1283459290211946596>');
		const buildings = new ButtonBuilder()
            .setCustomId('buildings_button')
            .setLabel('Buildings & Districts')
            .setStyle(ButtonStyle.Success)
            .setEmoji('<:paraarriba:1283459290211946596>>');
        const infrastructure = new ButtonBuilder()
            .setCustomId('infrastructure_button')
            .setLabel('Infrastructure')
            .setStyle(ButtonStyle.Success)
			.setEmoji('<:paraarriba:1283459290211946596>');
		const production = new ButtonBuilder()
            .setCustomId('production_button')
            .setLabel('Production')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('<:nut:1283459424773472256>');
		const trade = new ButtonBuilder()
            .setCustomId('trade_button')
            .setLabel('Trade Info')
            .setStyle(ButtonStyle.Primary)
			.setEmoji('<:business:1277981102681620591>');
		const help = new ButtonBuilder()
            .setCustomId('help_button')
            .setLabel('Help')
            .setStyle(ButtonStyle.Secondary)
			.setEmoji('<:mail:1283459557594628167>');
		const exit = new ButtonBuilder()
            .setCustomId('exit_button')
            .setLabel('Exit')
            .setStyle(ButtonStyle.Danger)
			.setEmoji('<:cross:1283459669020381268>');
		

		const buttonRowFirst = new ActionRowBuilder()
			.addComponents(baseStats, resources, buildings, infrastructure);
		const buttonRowSecond = new ActionRowBuilder()
			.addComponents(production, trade, help, exit);
		 
		// Embeds
		const statsEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle(`<:crown:1283459679682564268> Base Nation Stats - ${country.name}`)
            .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
Player: <@${user.id}>
            ‎`)
            .addFields({
                name: '◇──◇ <:bolsa:1283459731104727091> General Information <:bolsa:1283459731104727091> ◇──◇', value: `
<:information:1283459611696824453> **Population:** ${pops} pops // ~${roundDownNumber(pops * 1000000)} people
<:information:1283459611696824453> **Pop Growth:** ${popsGrowth}%
<:coin:1283459688511311944> **Available Funds:** ${roundDownNumber(funds)}F$
<:anotherstar:1277980123223560222> **Tax Rate:** ${taxRate}%
<:anotherstar:1277980123223560222> **Housing:** ${housing} // pops require ${pops} Housing Units.
<:anotherstar:1277980123223560222> **Building Slots:** ${buildingSlots} / NaN in use.
<:bang:1277980082790469695> **Instability:** ${instability}
<:bang:1277980082790469695> **Attrition:** ${attrition}
				‎ 
                `, })
            .addFields({
                name: '◇──◇ <:nut:1283459424773472256> Strategic Information <:nut:1283459424773472256> ◇──◇', value: `
<:coin:1283459688511311944> **Production Capacity:** ${productionCapacity}
<:food:1313227890023993375> **Food Status:** ${roundDownNumber(food)} - needs ${foodNeed}
<:precious_resources:1313227365211701358> **Amenities Status:** ${amenities} - needs ${amenitiesNeed}
<:linkastr:1284017210574246000> **Administrative Capacity:** ${administrativeCapacity} - needs ${adminNeed}
<:question_mark:1283459461620568145> **Research Capacity:** ${roundDownNumber(researchCapacity)}RPs
<:world:1283459444705071207> **Energy Generation:** ${roundDownNumber(energy)} - needs ${energyNeed}
<:nut:1283459424773472256> **Resource Storage Capacity:** ${roundDownNumber(resourceSilos)}
<:trophy_1:1283460086693363772> **Economic Level:** ${economicLevel}
				‎ 
                `,
			})
			.setImage(`https://media.discordapp.net/attachments/1283564570279018548/1283564571059028049/EconomicsBannerIMG.png?ex=67ad29a9&is=67abd829&hm=a0bb8274c34f5ba03b50dfff06bc03d857be16777b7d414e58ab14e2a4a2df29&=&format=webp&quality=lossless&width=1394&height=349`);

		const resourcesEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle(`<:crown:1283459679682564268> Resource Status - ${country.name}`)
            .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
Player: <@${user.id}>
            ‎`)
            .addFields({
                name: `◇──◇ <:precious_resources:1313227365211701358> Special Resources <:precious_resources:1313227365211701358> ◇──◇`, value: `
<:gold:1313227739326578808> **Gold** :: ${roundDownNumber(gold)} - expenditure: 
<:silver:1313227428834836561> **Silver** :: ${roundDownNumber(silver)} - expenditure: 
<:precious_resources:1313227365211701358> **Diamond** :: ${roundDownNumber(diamond)} - expenditure: 
<:rare_metals:1313227206582861946> **Platinum (PGEM)** :: ${roundDownNumber(pgem)} - expenditure: 
<:rare_metals:1313227206582861946> **Rare Earth Metals** :: ${roundDownNumber(rareearthmetals)} - expenditure: 
<:heavy_metals:1313227473844047883> **Tungsten** :: ${roundDownNumber(tungsten)} - expenditure: 
				‎ 
                `, })
            .addFields({
                name: '◇──◇ <:chromium:1313227314162700328> Metallic Resources <:chromium:1313227314162700328> ◇──◇', value: `
<:iron:1313227955098484736> **Iron** :: ${roundDownNumber(iron)} - expenditure: 
<:aluminum:1313228003571925092> **Zinc** :: ${roundDownNumber(zinc)} - expenditure: 
<:aluminum:1313228003571925092> **Tin** :: ${roundDownNumber(tin)} - expenditure: 
<:aluminum:1313228003571925092> **Aluminum** :: ${roundDownNumber(bauxite)} - expenditure: 
<:iron:1313227955098484736>  **Manganese** :: ${roundDownNumber(manganese)} - expenditure: 
<:copper:1313228077576224798> **Copper** :: ${roundDownNumber(copper)} - expenditure: 
<:chromium:1313227314162700328> **Chromium** :: ${roundDownNumber(chromium)} - expenditure: 
<:nickel:1313227259334627359> **Nickel** :: ${roundDownNumber(nickel)} - expenditure: 
<:radioactive_metals:1313227524737597470> **Uranium** :: ${roundDownNumber(uranium)} - expenditure: 
<:radioactive_metals:1313227524737597470> **Thorium** :: ${roundDownNumber(thorium)} - expenditure: 
<:heavy_metals:1313227473844047883> **Titanium** :: ${roundDownNumber(titanium)} - expenditure: 
				‎ 
                `,
			})
			.addFields({
                name: '◇──◇ <:hydrocarbons:1313227826211721236> Other Resources <:hydrocarbons:1313227826211721236> ◇──◇', value: `
<:coal:1313227590579916890> **Coal** :: ${roundDownNumber(coal)} - expenditure: 
<:coal:1313227590579916890> **Peat** :: ${roundDownNumber(peat)} - expenditure: 
<:hydrocarbons:1313227826211721236> **Oil** :: ${roundDownNumber(oil)} - expenditure: 
<:chromium:1313227314162700328> **Rubber** :: ${roundDownNumber(rubber)} - expenditure: 
				‎ 
                `,
			})

			
			.setImage(`https://media.discordapp.net/attachments/1283564570279018548/1283564571059028049/EconomicsBannerIMG.png?ex=67ad29a9&is=67abd829&hm=a0bb8274c34f5ba03b50dfff06bc03d857be16777b7d414e58ab14e2a4a2df29&=&format=webp&quality=lossless&width=1394&height=349`);

		const buildingsEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle(`<:crown:1283459679682564268> Buildings & Districts - ${country.name}`)
            .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
Player: <@${user.id}>
            ‎`)
            .addFields({
                name: `◇──◇ <:squarewater:1339356710808322069> Districts <:squarewater:1339356710808322069> ◇──◇`, value: `
<:oxide:1339356566784053319> **City Districts** :: ${commonCity}
<:magnet:1339356591706603651> **Metropolis Districts** :: ${metropolis}
<:redmagnet:1339357498716459049> **Megalopolis Districts** :: ${megalopolis}
<:beachball:1339357798231965696> **Touristic Districts** :: ${touristicDistrict}
<:fly:1339356637101559919> **Floating City Districts** :: ${floatingCity}
<:redlips:1339357612948455536> **Red Light Districts** :: ${redLightDistrict}
<:redlips:1339357612948455536> **Refugee Camps** :: ${refugeeCamp}
				‎ 
                `, })
            .addFields({
                name: '◇──◇ <:superconductor:1339356928731512915> Research Facilities <:superconductor:1339356928731512915> ◇──◇', value: `
<:mag:1277980019615858698> **Research Center** :: ${researchCenter} - producing ${researchCenter*200}RPs
<:glasses:1339357461634875462> **Research Complex** :: ${researchComplex} - producing ${researchComplex*500}RPs
<:googles:1339356798985175051> **Advanced Research Institute** :: ${advancedResearchInstitute} - producing ${advancedResearchInstitute*1500}RPs
				‎ 
                `,
			})
			.addFields({
                name: '◇──◇ <:capitalist:1339357174249426944> Industrial Facilities <:capitalist:1339357174249426944> ◇──◇', value: `
<:screw:1339357240749985884> **Industrial Hub** :: ${industrialHub} - provides ${industrialHub*25} Capacity 
<:toaster:1339356849962749954> **Large Industrial Hub** :: ${largeIndustrialHub} - provides ${largeIndustrialHub*60} Capacity 
<:tv:1339357553083154434> **Civilian Industrial Complex** :: ${civilianIndustrialComplex} - provides ${civilianIndustrialComplex*100} Capacity 
				‎ 
                `,
			})
			.addFields({
                name: '◇──◇ <:map:1339357515913236490> Naval Facilities <:map:1339357515913236490> ◇──◇', value: `
<:shell:1339356807470252062> **Shipyard** :: ${shipyard} - provides ${shipyard*25} Naval Capacity 
<:shell:1339356807470252062> **Large Shipyard** :: ${largeShipyard} - provides ${largeShipyard*25} Naval Capacity 
<:shell:1339356807470252062> **Super Massive Shipyard** :: ${superMassiveShipyard} - provides ${superMassiveShipyard*25} Naval Capacity 
				‎ 
                `,
			})
			.addFields({
                name: '◇──◇ <:nutflat:1339357434845859922> Other Buildings <:nutflat:1339357434845859922> ◇──◇', value: `
<:adorable:1283459759080738846> **Clinic** :: ${clinic} - provides (WIP)
<:adorable:1283459759080738846> **Hospital** :: ${hospital} - provides (WIP): 
<:book:1339357728929349722> **School** :: ${school} - provides (WIP)
<:book:1339357728929349722> **University** :: ${university} - provides (WIP)
<:usb:1339356623327592510> **Administrative Center** :: ${administrativeCenter} - provides (WIP)
<:pipe:1339356643426701394> **Small Commercial Hub** :: ${smallCommercialHub} - provides (WIP)
<:pipe:1339356643426701394> **Large Commercial Hub** :: ${largeCommercialHub} - provides (WIP)
				‎ 
                `,
			})
			.setImage(`https://media.discordapp.net/attachments/1283564570279018548/1283564571059028049/EconomicsBannerIMG.png?ex=67ad29a9&is=67abd829&hm=a0bb8274c34f5ba03b50dfff06bc03d857be16777b7d414e58ab14e2a4a2df29&=&format=webp&quality=lossless&width=1394&height=349`);
		
		if (country.icon != null) {
			statsEmbed.setThumbnail(`${country.iconURL()}`);
			resourcesEmbed.setThumbnail(`${country.iconURL()}`);
			buildingsEmbed.setThumbnail(`${country.iconURL()}`);
        } else {
            statsEmbed.setThumbnail(`${user.displayAvatarURL()}`);
			resourcesEmbed.setThumbnail(`${user.displayAvatarURL()}`);
			buildingsEmbed.setThumbnail(`${user.displayAvatarURL()}`);
		}
				
		const response = await interaction.followUp({
			content: '**Under Development!**',
			embeds: [statsEmbed],
			components: [buttonRowFirst, buttonRowSecond],
			withResponse: true,
		});

		const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 300_000 });
		
		collector.on('collect', async (interaction) => {

			if (interaction.customId === 'stats_button') {
				await interaction.update({
					content: '**Under Development!**',
					embeds: [statsEmbed],
					components: [buttonRowFirst, buttonRowSecond],
					withResponse: true,
				});
			} else if (interaction.customId === 'resources_button') {
				await interaction.update({
					content: '**Under Development!**',
					embeds: [resourcesEmbed],
					components: [buttonRowFirst, buttonRowSecond],
					withResponse: true,
				});
			} else if (interaction.customId === 'buildings_button') {
				await interaction.update({
					content: '**Under Development!**',
					embeds: [buildingsEmbed],
					components: [buttonRowFirst, buttonRowSecond],
					withResponse: true,
				});
			} else if (interaction.customId === 'exit_button') {
				await interaction.editReply({
					content: `**You have withdrawn from the economics screen! ${user}**`,
					embeds: [],
					components: [],
				});

				baseStats.setDisabled(true);
				resources.setDisabled(true);
				buildings.setDisabled(true);
				infrastructure.setDisabled(true);
				production.setDisabled(true);
				trade.setDisabled(true);
				help.setDisabled(true);
				exit.setDisabled(true);
			} else {
				channel.send(`Menu Unavailable!`)
				await interaction.update({
					content: '**Under Development!**',
					embeds: [statsEmbed],
					components: [buttonRowFirst, buttonRowSecond],
					withResponse: true,
				});
			}

			console.log("wip")
		});

		collector.on('end', async (interaction) => {
			baseStats.setDisabled(true);
			resources.setDisabled(true);
			buildings.setDisabled(true);
			infrastructure.setDisabled(true);
			production.setDisabled(true);
			trade.setDisabled(true);
			help.setDisabled(true);
			exit.setDisabled(true);
			channel.send(`The Economic Menu for ${country} has been closed due to timeout!`)
		});

		//interaction.reply(`DEV DATA >>> Coal in DB returns: ${coal}`)
	}
};