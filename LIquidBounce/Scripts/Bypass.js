(AnticheatBypass = registerScript({
    name: "Bypass",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

AnticheatBypass.registerModule({
    name: "Bypass",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        Mode: Setting.list({
            name: "Mode",
            default: "Vulcan",
            values: [
                "Vulcan",
                //"Watchdog",
                //"BlocksMC",
                //"Moon",
            ]
        }),
        
    },
}, function(module) {
    var Mode = module.settings.Mode.get()

    var tick = 0
    var tick2 = 0
    var airTicks = 0
    var HurtTime = 101
    var timesTped = 0
    var maxTp = 1000
    var timesdone = 0
    var oldPosY = 0
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
        timesTped = 0
        timesdone = 0
        oldPosY = plr.posY
    })
    module.on("disable", function(){
        timer.timerSpeed = 1
    })

    module.on("update", function() {
        var Mode = module.settings.Mode.get()
        module.tag = Mode

        if (Mode == "Vulcan" && tick > 12) {
            tick = 0
            sendNewPacket(new C0BPacketEntityAction(plr, C0BPacketEntityAction.Action.STOP_SNEAKING))
        }

        if (Mode == "Watchdog") {
            if (timesTped < maxTp) {
                if (plr.onGround && timesdone == 0) {
                    plr.jump()
                    timer.timerSpeed = 1
                    timesdone ++
                }else if (airTicks > 3) {
                    plr.motionY = 0
                    timer.timerSpeed = 0.45
                    sendNewPacket(new C04PacketPlayerPosition(plr.posX, plr.posY - 3, plr.posZ, true))
                }else if (timesdone > 0){
                    timesdone = 220
                }
            }else{
                timer.timerSpeed = 1
            }
        }

        if (plr.onGround) {airTicks = 0}else{airTicks++}
        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        tick++
        tick2++
    })

    module.on("packet", function(eventPacket) {
        var packet = eventPacket.getPacket()

        if (packet instanceof C0FPacketConfirmTransaction && Mode == "Test" && tick > 1) {
            tick = 0
            eventPacket.cancelEvent()
        }

        if (packet instanceof C04PacketPlayerPosition && Mode == "Miniblox") {
            Chat.print(packet.x + " : " + packet.z)
        }

        if ((packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && Mode == "Vulcan" && HurtTime < 3 && plr.onGround) {
            //packet.onGround = false
            //plr.motionY = 0
        }

        if (packet instanceof C04PacketPlayerPosition && Mode == "Watchdog" && timesTped < maxTp) {
            packet.y = plr.posY + 5
        }

        if ((packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && Mode == "Moon" && airTicks > 0 && airTicks < 11) {
            packet.y = oldPosY
            packet.onGround = true
        }
    })
})
